import {
	Structure,
	Project,
	SyntaxKind,
	TypeAliasDeclaration,
	InterfaceDeclaration,
	ClassDeclaration,
	TypeReferenceNode,
} from "ts-morph";

// Usage: npx ts-node remove_generics_transform.ts <inputFile> <outputFile>
const [, , inputFile, outputFile] = process.argv;
if (!inputFile || !outputFile) {
	console.error(
		"Usage: ts-node remove_generics_transform.ts <inputFile> <outputFile>",
	);
	process.exit(1);
}

const project = new Project({ tsConfigFilePath: undefined });

// Read original file into a new output file
const originalFile = project.addSourceFileAtPath(inputFile);
const outFile = project.createSourceFile(
	outputFile,
	originalFile.getFullText(),
	{ overwrite: true },
);

// 1. Collect generic declarations
const genericDecls = new Map<
	string,
	{
		decl: TypeAliasDeclaration | InterfaceDeclaration | ClassDeclaration;
		typeParams: string[];
	}
>();

outFile.getTypeAliases().forEach((alias) => {
	const params = alias.getTypeParameters();
	if (params.length > 0) {
		genericDecls.set(alias.getName(), {
			decl: alias,
			typeParams: params.map((p) => p.getName()),
		});
	}
});

outFile.getInterfaces().forEach((intf) => {
	const params = intf.getTypeParameters();
	if (params.length > 0) {
		genericDecls.set(intf.getName(), {
			decl: intf,
			typeParams: params.map((p) => p.getName()),
		});
	}
});

outFile.getClasses().forEach((cls) => {
	const params = cls.getTypeParameters();
	if (params.length > 0) {
		const name = cls.getName();
		if (!name) return;
		genericDecls.set(name, {
			decl: cls,
			typeParams: params.map((p) => p.getName()),
		});
	}
});

// 2. Inline generic usages
outFile.forEachDescendant((node) => {
	if (node.getKind() === SyntaxKind.TypeReference) {
		const typeRef = node as TypeReferenceNode;
		const typeName = typeRef.getTypeName().getText();
		const entry = genericDecls.get(typeName);
		if (!entry) return;
		const args = typeRef.getTypeArguments();
		const { decl, typeParams } = entry;
		if (args.length !== typeParams.length) return;
		let replacement = "";
		if (Structure.isTypeAlias(TypeAliasDeclaration)) {
			const typeNode = decl.getType();
			if (!typeNode) return;
			const textNode = typeNode.getText();
			// Substitute each type parameter with the provided argument text
			let text = textNode;
			for (let i = 0; i < typeParams.length; i++) {
				const argNode = args[i];
				if (!argNode) return;
				const argText = argNode.getText();
				text = text.replace(new RegExp(`\b${typeParams[i]}\b`, "g"), argText);
			}
			replacement = `(${text})`;
		} else if (Structure.isInterface(decl) || Structure.isClass(decl)) {
			let block = decl.getText();
			block = block.replace(/<[^>]+>/, "");
			typeParams.forEach((p, i) => {
				const argText = args[i]!.getText();
				block = block.replace(new RegExp(`\\b${p}\\b`, "g"), argText);
			});
			replacement = block;
		}
		if (replacement) node.replaceWithText(replacement);
	}
});

// 3. Remove generic declarations
genericDecls.forEach(({ decl }) => decl.remove());

// 4. Save output
project.saveSync();
console.log(`Transformed file written: ${outputFile}`);
