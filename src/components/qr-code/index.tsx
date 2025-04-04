import { tag, WeElement, h, render } from 'omi'

@tag('qr-code')
export default class QRCodeComponent extends WeElement {
  static css = `
    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
    }
    .qr-input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 300px;
    }
    .qr-button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .qr-button:hover {
      background-color: #45a049;
    }
    .qr-canvas {
      margin-top: 20px;
      border: 1px solid #ccc;
    }
  `

  url = ''
  canvasRef: HTMLCanvasElement | null = null

  handleInput = (e: Event) => {
    this.url = (e.target as HTMLInputElement).value
    this.update()
  }

  generateQR = () => {
    if (this.url && this.canvasRef) {
      const canvas = this.canvasRef
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // 设置画布大小
      const size = 200
      canvas.width = size
      canvas.height = size

      // 清空画布
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, size, size)

      // 绘制二维码图案
      ctx.fillStyle = 'black'
      const moduleSize = size / 21 // 21x21 的二维码
      
      // 绘制定位图案
      this.drawFinderPattern(ctx, 0, 0, moduleSize)
      this.drawFinderPattern(ctx, size - 7 * moduleSize, 0, moduleSize)
      this.drawFinderPattern(ctx, 0, size - 7 * moduleSize, moduleSize)

      // 绘制数据
      this.drawData(ctx, this.url, moduleSize, size)
    }
  }

  drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) {
    // 绘制外框
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
    // 绘制内框
    ctx.fillStyle = 'white'
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
    // 绘制中心点
    ctx.fillStyle = 'black'
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
  }

  drawData(ctx: CanvasRenderingContext2D, text: string, moduleSize: number, size: number) {
    // 简单的数据编码示例
    const data = this.encodeText(text)
    let x = 0
    let y = 0

    for (let i = 0; i < data.length; i++) {
      if (data[i] === '1') {
        ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
      }
      x++
      if (x >= 21) {
        x = 0
        y++
      }
    }
  }

  encodeText(text: string): string {
    // 简单的编码示例，实际应用中应该使用更复杂的编码算法
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i)
      result += charCode.toString(2).padStart(8, '0')
    }
    return result
  }

  render() {
    return (
      <div class="qr-container">
        <input
          class="qr-input"
          type="text"
          value={this.url}
          onInput={this.handleInput}
          placeholder="输入要生成二维码的URL"
        />
        <button class="qr-button" onClick={this.generateQR}>
          生成二维码
        </button>
        <canvas
          ref={(e) => (this.canvasRef = e)}
          class="qr-canvas"
          width="200"
          height="200"
        />
      </div>
    )
  }
} 