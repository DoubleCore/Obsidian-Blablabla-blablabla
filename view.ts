import { ItemView, TFile, TFolder, WorkspaceLeaf } from "obsidian";

export const GALLERY_VIEW_TYPE = "gallery-view";

export class GalleryView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return GALLERY_VIEW_TYPE;
	}

	getDisplayText() {
		return "Gallery";
	}

	async setState(state: any) {
        const folderPath = state?.folderPath;
        if (folderPath) {
            this.draw(folderPath);
        }
    }

	async onOpen() {
		const folderPath = this.leaf.getViewState().state?.folderPath;
        if (folderPath) {
            this.draw(folderPath);
        } else {
            const container = this.contentEl;
            container.empty();
            container.createEl("h2", { text: "画廊视图" });
            container.createEl("p", { text: "请在文件浏览器中右键点击一个文件夹，然后选择 '以画廊形式查看'。" });
        }
	}

	async draw(folderPath: string) {
		const container = this.contentEl;
		container.empty();

		// Add a CSS class to the container for styling
		container.addClass("gallery-view-container");

		const folder = this.app.vault.getAbstractFileByPath(folderPath);

		if (!(folder instanceof TFolder)) {
			container.createEl("h2", { text: `错误：找不到文件夹 "${folderPath}"` });
			return;
		}

		// Create a grid container for the cards
		const gridContainer = container.createDiv({ cls: "gallery-grid" });

		for (const file of folder.children) {
			if (file instanceof TFile && file.extension === 'md') {
				const card = gridContainer.createDiv({ cls: "gallery-card" });
				card.createEl("h3", { text: file.basename }); // Use basename to get name without extension

				// Add click event to open the note
				card.addEventListener('click', () => {
					this.app.workspace.getLeaf(true).openFile(file);
				});
			}
		}

		if (gridContainer.children.length === 0) {
			container.createEl("p", {text: "这个文件夹里没有 Markdown 文件。"});
		}
	}

	async onClose() {
		// 目前这里不需要清理任何东西
	}
}
