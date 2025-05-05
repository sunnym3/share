import html2canvas from 'html2canvas'

interface ScreenshotOptions {
    backgroundColor?: string;
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    logging?: boolean;
}

interface ScreenshotResult {
    base64: string;
    width: number;
    height: number;
}

/**
 * 对指定DOM元素进行截图
 * @param element - 要截图的DOM元素
 * @param options - 截图选项
 * @returns Promise<ScreenshotResult> - 返回base64格式的图片数据和尺寸
 */
export async function captureElement(
    element: HTMLElement,
    options: ScreenshotOptions = {}
): Promise<ScreenshotResult> {
    // 默认配置
    const defaultOptions: ScreenshotOptions = {
        backgroundColor: '#ffffff',
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: true,
        logging: false
    };

    // 合并配置
    const finalOptions = { ...defaultOptions, ...options };

    try {
        // 在截图前处理可能的问题元素
        const problematicElements = element.querySelectorAll('*[style*="gradient"]');
        const originalStyles = new Map();
        
        // 保存并修改渐变元素的样式
        problematicElements.forEach(el => {
            originalStyles.set(el, el.getAttribute('style'));
            (el as HTMLElement).style.background = finalOptions.backgroundColor || '#ffffff';
        });
        
        // 执行截图
        const canvas = await html2canvas(element, {
            ...finalOptions,
            onclone: (clonedDoc: Document) => {
                // 在克隆的文档中处理渐变
                const clonedElement = clonedDoc.querySelector(element.tagName.toLowerCase());
                if (clonedElement) {
                    const clonedProblematicElements = clonedElement.querySelectorAll('*[style*="gradient"]');
                    clonedProblematicElements.forEach((el: Element) => {
                        (el as HTMLElement).style.background = finalOptions.backgroundColor || '#ffffff';
                    });
                }
            }
        } as any);
        
        // 恢复原始样式
        problematicElements.forEach(el => {
            const originalStyle = originalStyles.get(el);
            if (originalStyle) {
                el.setAttribute('style', originalStyle);
            }
        });
        
        // 返回图片数据和尺寸
        return {
            base64: canvas.toDataURL('image/png'),
            width: canvas.width,
            height: canvas.height
        };
    } catch (error) {
        console.error('截图失败:', error);
        throw error;
    }
}

/**
 * 下载截图
 * @param base64Image - base64格式的图片数据
 * @param filename - 文件名
 */
export function downloadScreenshot(base64Image: string, filename: string = 'screenshot.png'): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = base64Image;
    link.click();
}
