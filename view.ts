import { ItemView, WorkspaceLeaf } from "obsidian";

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
		container.createEl("h2", { text: `画廊视图` });
		container.createEl("p", { text: `当前文件夹: ${folderPath}` });
	}

	async onClose() {
		// 目前这里不需要清理任何东西
	}
}
