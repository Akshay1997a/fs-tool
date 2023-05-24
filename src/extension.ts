import * as vscode from 'vscode';
import * as path from 'path'

export function activate(context: vscode.ExtensionContext) {
	console.log('extension "filer" is now active!');

	let disposable = vscode.commands.registerTextEditorCommand('filer.openBrowse', async (textEditor) => {
		try {
			let folderUri = null;

			let { activeTextEditor } = vscode.window
			if (activeTextEditor?.document.fileName) {
				const currentlyOpenTabfilePath = activeTextEditor.document.fileName
				folderUri = vscode.Uri.file(path.dirname(currentlyOpenTabfilePath))
			}

			if(folderUri === null) {
				let message = "YOUR-EXTENSION: Working folder not found, open a folder an try again";
				throw new Error(message)
			}

			const dialogOptions : vscode.OpenDialogOptions = {
				title: "Select file",
				canSelectMany: false,
				defaultUri: folderUri,
			}
			let fileUrls = await vscode.window.showOpenDialog(dialogOptions)
			if (fileUrls === null || fileUrls === undefined) throw new Error("Failed to get file uri!")
			fileUrls.forEach((fileUrl) => {
				textEditor.edit((editBuilder) => {
					editBuilder.delete(textEditor.selection)
					editBuilder.insert(textEditor.selection.active, fileUrl.path);
				})
			})
		} catch (error : any) {
			console.log(error)
			vscode.window.showErrorMessage(error);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
