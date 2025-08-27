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

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h2", { text: "画廊视图" });
	}

	async onClose() {
		// 目前这里不需要清理任何东西
	}
}
