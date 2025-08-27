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

				// --- 视觉优化逻辑 ---

				const fileCache = this.app.metadataCache.getFileCache(file);

				// 1. 查找封面图片
				let imageUrl: string | null = null;
				const imagePath = fileCache?.frontmatter?.image || fileCache?.frontmatter?.cover;

				if (imagePath) {
					const imageFile = this.app.metadataCache.getFirstLinkpathDest(imagePath, file.path);
					if (imageFile instanceof TFile) {
						imageUrl = this.app.vault.getResourcePath(imageFile);
					}
				} else {
					const firstEmbed = fileCache?.embeds?.find(embed => /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(embed.link));
					if (firstEmbed) {
						const imageFile = this.app.metadataCache.getFirstLinkpathDest(firstEmbed.link, file.path);
						if (imageFile instanceof TFile) {
							imageUrl = this.app.vault.getResourcePath(imageFile);
						}
					}
				}

				const imageContainer = card.createDiv({ cls: "gallery-card-image-container" });
				if (imageUrl) {
					imageContainer.createEl("img", { attr: { src: imageUrl }, cls: "gallery-card-image" });
				} else {
					imageContainer.addClass("no-image");
				}
				
				const textContainer = card.createDiv({ cls: "gallery-card-text-container" });

				// 2. 添加标题
				textContainer.createEl("h3", { text: file.basename });

				// 3. 添加内容摘要
				const content = await this.app.vault.cachedRead(file);
				const summaryText = content
					.replace(/---[\s\S]*?---/, "") // 移除 frontmatter
					.replace(/#+\s/g, "")           // 移除标题标记
					.replace(/(\[\[.*?\]\]|\[.*?\]\(.*?\))/g, "") // 移除链接
					.replace(/[*_`~]/g, "")         // 移除强调符号
					.trim()
					.slice(0, 100);

				if (summaryText) {
					textContainer.createEl("p", { text: summaryText + "...", cls: "gallery-card-summary" });
				}
				
				// --- 结束 ---

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
