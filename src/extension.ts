import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "filer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('filer.openBrowse', async (textEditor, edit) => {
		try {
			if (vscode.workspace.workspaceFolders?.length) {
				const currentWorkpacePath = vscode.workspace.workspaceFolders[0].uri
				let fileUrls = await vscode.window.showOpenDialog({
					title: "Select file",
					canSelectMany: false,
					defaultUri: currentWorkpacePath
				})
				if(fileUrls === null || fileUrls === undefined) throw new Error("Failed to get file uri!")
				console.log(fileUrls)
				fileUrls.forEach((fileUrl) => {
					textEditor.edit((editBuilder) => {
						editBuilder.replace(textEditor.selection.active, fileUrl.path)
					})
				})
			} else {
				let message = "YOUR-EXTENSION: Working folder not found, open a folder an try again" ;
				vscode.window.showErrorMessage(message);
			}
		} catch (error) {
			console.log(error)
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
