import { Plugin, TFolder, Menu } from 'obsidian';
import { GalleryView, GALLERY_VIEW_TYPE } from './view';


export default class GalleryPlugin extends Plugin {

	async onload() {
		this.registerView(
			GALLERY_VIEW_TYPE,
			(leaf) => new GalleryView(leaf)
		);

		this.registerEvent(
			this.app.workspace.on('file-menu', (menu: Menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setTitle("以画廊形式查看")
							.setIcon("blocks")
							.onClick(async () => {
								// Close any existing gallery views
								this.app.workspace.detachLeavesOfType(GALLERY_VIEW_TYPE);

								// Open a new leaf for the gallery view
								const newLeaf = this.app.workspace.getLeaf(true);

								// Set the view state to our gallery view, passing the folder path
								await newLeaf.setViewState({
									type: GALLERY_VIEW_TYPE,
									active: true,
									state: { folderPath: file.path },
								});

								// Reveal the new leaf
								this.app.workspace.revealLeaf(newLeaf);
							});
					});
				}
			})
		);
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(GALLERY_VIEW_TYPE);
	}
}
