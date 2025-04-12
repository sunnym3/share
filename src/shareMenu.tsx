import { h, tag, Component } from 'omi'
import cssString from './shareMenu.css?raw'
import { generateQRCode } from './util/qrcode'


@tag('share-menu')
export default class extends Component {

  static css = cssString

  private isMenuOpen = false
  private isMobile = false
  private hasWebShareAPI = false


  private dialogElement: HTMLDialogElement | null = null
  private shareButtonElement: HTMLButtonElement | null = null
  private mediaButtons: HTMLButtonElement[] = []
  private currentToggledButton: HTMLButtonElement | null = null
  private menuContainer: HTMLDivElement | null = null

  static propTypes = {
    name: String,
    url: String
  }


  // 定义菜单项数据
  private shareOptions = [
    {
      name: '微信',
      icon: '<svg x="0px" y="0px" width="10" height="10" viewBox="0 0 48 48"><path fill="#8BC34A" d="M18,6C9.2,6,2,12,2,19.5c0,4.3,2.3,8,6,10.5l-2,6l6.3-3.9C14,32.7,16,33,18,33c8.8,0,16-6,16-13.5C34,12,26.8,6,18,6z"></path><path fill="#7CB342" d="M20,29c0-6.1,5.8-11,13-11c0.3,0,0.6,0,0.9,0c-0.1-0.7-0.3-1.4-0.5-2c-0.1,0-0.3,0-0.4,0c-8.3,0-15,5.8-15,13c0,1.4,0.3,2.7,0.7,4c0.7,0,1.4-0.1,2.1-0.2C20.3,31.6,20,30.3,20,29z"></path><path fill="#CFD8DC" d="M46,29c0-6.1-5.8-11-13-11c-7.2,0-13,4.9-13,11s5.8,11,13,11c1.8,0,3.5-0.3,5-0.8l5,2.8l-1.4-4.8C44.3,35.2,46,32.3,46,29z"></path><path fill="#33691E" d="M14,15c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,13.9,14,15z M24,13c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S25.1,13,24,13z"></path><path fill="#546E7A" d="M30,26.5c0,0.8-0.7,1.5-1.5,1.5S27,27.3,27,26.5s0.7-1.5,1.5-1.5S30,25.7,30,26.5z M37.5,25c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S38.3,25,37.5,25z"></path></svg>',
      shareMethods: {
        pc: {
          qrcode: async (data: any) => {
            try {
              await this.generateQRCode(data.props.url)
            } catch (error) {
              console.error('生成二维码失败:', error)
            }
          },
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)

          }
        },
        mobile: {
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)
          }
        }
      }
    },
    {
      name: 'QQ',
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12.003 2c-5.514 0-9.999 4.486-9.999 10 0 5.515 4.485 10 9.999 10 5.515 0 10-4.485 10-10 0-5.514-4.485-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
      handleShare: (data: any) => {
        console.log(data)
        const url = 'https://www.baidu.com/index.php?tn=75144485_1_dg&ch=9'

        if (data.meta.isMobile) {
          // 移动端先复制链接到剪贴板，再跳转
          // 使用兼容性更好的方法复制到剪贴板


          // 尝试复制
          const copySuccess = this.copyToClipboard(url)

          // 显示复制结果提示
          const toast = document.createElement('div')
          toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
          toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
          document.body.appendChild(toast)
          setTimeout(() => {
            document.body.removeChild(toast)
          }, 2000)

          // 无论复制是否成功，都尝试跳转到QQ
          window.location.href = `mqq://`
        } else {
          window.location.href = 'http://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent('https://github.com/yujiangshui/simple-share.js/blob/master/lib/simple-share.js') + '&desc=231&pics=1'
        }
      },
      shareMethods: {
        pc: {
          qrcode: async (data: any) => {
            try {
              await this.generateQRCode(data.props.url)
            } catch (error) {
              console.error('生成二维码失败:', error)
            }
          },
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)

          }
        },
        mobile: {
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)
          }
        }
      }
    },
    {
      name: '微博',
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.096-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.313.355.18.601l.014-.018zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.615.375-.977.42-1.804 0-2.404-.781-1.112-2.915-1.053-5.364-.03 0 0-.766.331-.571-.271.376-1.217.315-2.224-.27-2.809-1.338-1.337-4.869.045-7.888 3.08C1.309 10.87 0 13.273 0 15.348c0 3.981 5.099 6.395 10.086 6.395 6.536 0 10.888-3.801 10.888-6.82 0-1.822-1.547-2.854-2.915-3.284v.01zm1.908-5.092c-.766-.856-1.908-1.187-2.96-.962-.436.09-.706.511-.616.932.09.42.511.691.932.602.511-.105 1.067.044 1.442.465.376.421.466.992.271 1.498-.135.406.105.812.521.947.405.119.812-.105.947-.512.33-.992.12-2.113-.596-2.96h.039zm2.25-2.719c-1.576-1.757-3.905-2.419-6.054-1.968-.496.104-.812.587-.706 1.083.104.496.586.811 1.082.707 1.532-.331 3.185.15 4.296 1.383.977 1.082 1.307 2.404.947 3.704-.135.496.105 1.007.601 1.142.496.135 1.007-.105 1.142-.601.496-1.842.09-3.644-1.308-5.046l.09.09z"/></svg>',
      handleShare: (data: any) => {
        console.log(data)
        const url = data.props.url || 'https://www.baidu.com/index.php?tn=75144485_1_dg&ch=9'
        const title = data.props.title || '分享一个链接'

        if (data.meta.isMobile) {
          // 移动端使用微博URL Scheme
          window.location.href = `sinaweibo://share?content=${encodeURIComponent(title + ' ' + url)}`

          // 如果微博未安装，3秒后跳转到微博网页版
          setTimeout(() => {
            window.location.href = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
          }, 3000)
        } else {
          // PC端直接跳转到微博分享页面
          window.location.href = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
        }
      },
      shareMethods: {
        pc: {
          qrcode: async (data: any) => {
            try {
              await this.generateQRCode(data.props.url)
            } catch (error) {
              console.error('生成二维码失败:', error)
            }
          },
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)

          }
        },
        mobile: {
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)
          }
        }
      }
    },
    {
      name: '微信',
      icon: '<svg x="0px" y="0px" width="10" height="10" viewBox="0 0 48 48"><path fill="#8BC34A" d="M18,6C9.2,6,2,12,2,19.5c0,4.3,2.3,8,6,10.5l-2,6l6.3-3.9C14,32.7,16,33,18,33c8.8,0,16-6,16-13.5C34,12,26.8,6,18,6z"></path><path fill="#7CB342" d="M20,29c0-6.1,5.8-11,13-11c0.3,0,0.6,0,0.9,0c-0.1-0.7-0.3-1.4-0.5-2c-0.1,0-0.3,0-0.4,0c-8.3,0-15,5.8-15,13c0,1.4,0.3,2.7,0.7,4c0.7,0,1.4-0.1,2.1-0.2C20.3,31.6,20,30.3,20,29z"></path><path fill="#CFD8DC" d="M46,29c0-6.1-5.8-11-13-11c-7.2,0-13,4.9-13,11s5.8,11,13,11c1.8,0,3.5-0.3,5-0.8l5,2.8l-1.4-4.8C44.3,35.2,46,32.3,46,29z"></path><path fill="#33691E" d="M14,15c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,13.9,14,15z M24,13c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S25.1,13,24,13z"></path><path fill="#546E7A" d="M30,26.5c0,0.8-0.7,1.5-1.5,1.5S27,27.3,27,26.5s0.7-1.5,1.5-1.5S30,25.7,30,26.5z M37.5,25c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S38.3,25,37.5,25z"></path></svg>',
      shareMethods: {
        pc: {
          qrcode: async (data: any) => {
            try {
              await this.generateQRCode(data.props.url)
            } catch (error) {
              console.error('生成二维码失败:', error)
            }
          },
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)

          }
        },
        mobile: {
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)
          }
        }
      }
    },
    {
      name: '微信',
      icon: '<svg x="0px" y="0px" width="10" height="10" viewBox="0 0 48 48"><path fill="#8BC34A" d="M18,6C9.2,6,2,12,2,19.5c0,4.3,2.3,8,6,10.5l-2,6l6.3-3.9C14,32.7,16,33,18,33c8.8,0,16-6,16-13.5C34,12,26.8,6,18,6z"></path><path fill="#7CB342" d="M20,29c0-6.1,5.8-11,13-11c0.3,0,0.6,0,0.9,0c-0.1-0.7-0.3-1.4-0.5-2c-0.1,0-0.3,0-0.4,0c-8.3,0-15,5.8-15,13c0,1.4,0.3,2.7,0.7,4c0.7,0,1.4-0.1,2.1-0.2C20.3,31.6,20,30.3,20,29z"></path><path fill="#CFD8DC" d="M46,29c0-6.1-5.8-11-13-11c-7.2,0-13,4.9-13,11s5.8,11,13,11c1.8,0,3.5-0.3,5-0.8l5,2.8l-1.4-4.8C44.3,35.2,46,32.3,46,29z"></path><path fill="#33691E" d="M14,15c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,13.9,14,15z M24,13c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S25.1,13,24,13z"></path><path fill="#546E7A" d="M30,26.5c0,0.8-0.7,1.5-1.5,1.5S27,27.3,27,26.5s0.7-1.5,1.5-1.5S30,25.7,30,26.5z M37.5,25c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S38.3,25,37.5,25z"></path></svg>',
      shareMethods: {
        pc: {
          qrcode: async (data: any) => {
            try {
              await this.generateQRCode(data.props.url)
            } catch (error) {
              console.error('生成二维码失败:', error)
            }
          },
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)

          }
        },
        mobile: {
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)
          }
        }
      }
    },
    {
      name: '微信',
      icon: '<svg x="0px" y="0px" width="10" height="10" viewBox="0 0 48 48"><path fill="#8BC34A" d="M18,6C9.2,6,2,12,2,19.5c0,4.3,2.3,8,6,10.5l-2,6l6.3-3.9C14,32.7,16,33,18,33c8.8,0,16-6,16-13.5C34,12,26.8,6,18,6z"></path><path fill="#7CB342" d="M20,29c0-6.1,5.8-11,13-11c0.3,0,0.6,0,0.9,0c-0.1-0.7-0.3-1.4-0.5-2c-0.1,0-0.3,0-0.4,0c-8.3,0-15,5.8-15,13c0,1.4,0.3,2.7,0.7,4c0.7,0,1.4-0.1,2.1-0.2C20.3,31.6,20,30.3,20,29z"></path><path fill="#CFD8DC" d="M46,29c0-6.1-5.8-11-13-11c-7.2,0-13,4.9-13,11s5.8,11,13,11c1.8,0,3.5-0.3,5-0.8l5,2.8l-1.4-4.8C44.3,35.2,46,32.3,46,29z"></path><path fill="#33691E" d="M14,15c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,13.9,14,15z M24,13c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S25.1,13,24,13z"></path><path fill="#546E7A" d="M30,26.5c0,0.8-0.7,1.5-1.5,1.5S27,27.3,27,26.5s0.7-1.5,1.5-1.5S30,25.7,30,26.5z M37.5,25c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S38.3,25,37.5,25z"></path></svg>',
      shareMethods: {
        pc: {
          qrcode: async (data: any) => {
            try {
              await this.generateQRCode(data.props.url)
            } catch (error) {
              console.error('生成二维码失败:', error)
            }
          },
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)

          }
        },
        mobile: {
          copy: async (data: any) => {
            const copySuccess = this.copyToClipboard(data.props.url)
            const toast = document.createElement('div')
            toast.textContent = copySuccess ? '链接已复制到剪贴板' : '复制失败，请手动复制'
            toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999;'
            document.body.appendChild(toast)
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 2000)
          }
        }
      }
    },
  ]

  private currentPage = 0
  private totalPages = Math.ceil(this.shareOptions.length / 4)


  private copyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '0'
    document.body.appendChild(textArea)

    // 选择文本并复制
    textArea.focus()
    textArea.select()

    let success = false
    try {
      success = document.execCommand('copy')
    } catch (err) {
      console.error('复制失败:', err)
    }

    // 移除临时输入框
    document.body.removeChild(textArea)

    return success
  }

  private toggleMenu = async () => {
    if (this.hasWebShareAPI && this.isMobile) {
      try {
        const shareData = {
        }
        await navigator.share(shareData)
        return
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }

    this.update()
  }

  private checkDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    // 检测是否支持 Web Share API
    this.hasWebShareAPI = 'share' in navigator
  }

  install() {
    this.checkDeviceType()
  }

  installed() {
    // 获取 share-menu 元素
    const shareMenuElement = document.querySelector('share-menu')
    if (shareMenuElement?.shadowRoot) {
      if (!this.isMobile) {
        this.shareButtonElement = shareMenuElement.shadowRoot.querySelector('.share-button')
        console.log(this.shareButtonElement)
        if (this.shareButtonElement) {
          // 设置初始状态
          this.dialogElement = shareMenuElement.shadowRoot.querySelector('dialog')
          this.mediaButtons = Array.from(this.dialogElement?.querySelectorAll('.media-button') || []) as HTMLButtonElement[]

          console.log(this.dialogElement)
          console.log(this.mediaButtons)

          this.shareButtonElement.addEventListener('click', () => {
            if (!this.isMenuOpen) {
              this.dialogElement!.style.display = 'flex'

              this.mediaButtons?.forEach((mediaButton, i) => {
                console.log('click button')
                mediaButton.classList.add('initial-animation');
                (mediaButton as HTMLElement).style.animationDelay = `${i * 0.05}s`
              })
            } else {
              this.dialogElement!.style.display = 'none'

              this.mediaButtons?.forEach((mediaButton) => {
                (mediaButton as HTMLElement).style.opacity = '0'
                mediaButton.classList.remove('initial-animation');
              })
            }

            this.isMenuOpen = !this.isMenuOpen
            console.log('isMenuOpen', this.isMenuOpen)
          })


          this.mediaButtons?.forEach((mediaButton, i) => {
            mediaButton.addEventListener('animationend', () => {
              console.log('animationend');
              (mediaButton as HTMLElement).style.opacity = '1'
              mediaButton.classList.remove('initial-animation');
              (mediaButton as HTMLElement).style.animationDelay = `0s`
            })
            mediaButton.addEventListener('click', () => {
              if (!this.currentToggledButton) {
                console.log('intial state')
                this.currentToggledButton = mediaButton
              } else if (this.currentToggledButton != mediaButton) {
                this.currentToggledButton?.classList.toggle('plus--active')
                this.currentToggledButton = mediaButton
              } else {
                this.currentToggledButton = null
              }
              mediaButton.classList.toggle('plus--active')
            })


          })
        }
      } else {
        this.shareButtonElement = shareMenuElement.shadowRoot.querySelector('.share-button')
        console.log(this.shareButtonElement)
        if (this.shareButtonElement) {

          const menuOverlay = shareMenuElement.shadowRoot.querySelector('.menu-overlay')
          const bottomMenu = shareMenuElement.shadowRoot.querySelector('.bottom-menu')
          this.menuContainer = shareMenuElement.shadowRoot.querySelector('.menu-container')

          this.shareButtonElement.addEventListener('click', () => {
            console.log('click')
            this.isMenuOpen = !this.isMenuOpen
            menuOverlay?.classList.add('active')
            bottomMenu?.classList.add('active')
          })

          menuOverlay?.addEventListener('click', () => {
            this.isMenuOpen = !this.isMenuOpen
            menuOverlay?.classList.remove('active')
            bottomMenu?.classList.remove('active')
          })

          // 添加触摸事件监听
          if (this.menuContainer) {
            this.menuContainer.addEventListener('touchstart', this.handleTouchStart as EventListener)
            this.menuContainer.addEventListener('touchmove', this.handleTouchMove as EventListener)
            this.menuContainer.addEventListener('touchend', this.handleTouchEnd as EventListener)
          }

          // 添加分页点点击事件
          const paginationDots = shareMenuElement.shadowRoot.querySelectorAll('.pagination-dot')
          paginationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
              this.goToPage(index)
            })
          })
        }
      }
    }
  }

  private generateQRCode = async (url: string) => {
    try {
      const qrCodeUrl = await generateQRCode(url, {
        width: 200,
        height: 200,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })

      // 创建二维码弹窗
      const dialog = document.createElement('dialog')
      dialog.style.cssText = 'padding: 20px; border-radius: 8px; border: none;'

      const img = document.createElement('img')
      img.src = qrCodeUrl
      img.style.cssText = 'width: 200px; height: 200px;'

      const closeButton = document.createElement('button')
      closeButton.textContent = '关闭'
      closeButton.style.cssText = 'margin-top: 10px; padding: 5px 10px;'
      closeButton.onclick = () => dialog.close()

      dialog.appendChild(img)
      dialog.appendChild(closeButton)
      document.body.appendChild(dialog)
      dialog.showModal()
    } catch (error) {
      throw error
    }
  }

  private goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.currentPage = pageIndex
      if (this.menuContainer) {
        this.menuContainer.style.transform = `translateX(-${pageIndex * 100}%)`
      }
      this.update()
    }
  }

  private handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    this.touchStartX = touch.clientX
  }

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.touchStartX) return

    const touch = e.touches[0]
    const diffX = this.touchStartX - touch.clientX

    if (this.menuContainer) {
      // 添加一些阻力，防止滑动过度
      const resistance = 0.5
      const translateX = -this.currentPage * 100 - (diffX * resistance / this.menuContainer.offsetWidth * 100)
      this.menuContainer.style.transform = `translateX(${translateX}%)`
    }
  }

  private handleTouchEnd = (e: TouchEvent) => {
    if (!this.touchStartX) return

    const touch = e.changedTouches[0]
    const diffX = this.touchStartX - touch.clientX

    // 如果滑动距离足够大，切换页面
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && this.currentPage < this.totalPages - 1) {
        // 向左滑动，下一页
        this.goToPage(this.currentPage + 1)
      } else if (diffX < 0 && this.currentPage > 0) {
        // 向右滑动，上一页
        this.goToPage(this.currentPage - 1)
      } else {
        // 回到当前页
        this.goToPage(this.currentPage)
      }
    } else {
      // 回到当前页
      this.goToPage(this.currentPage)
    }

    this.touchStartX = null
  }

  private touchStartX: number | null = null

  // pc
  // 微信，qq生成二维码，其他平台跳转
  // 移动端
  // 检测是否支持web share api，支持则调用，否则微信，qq 复制链接＋url scheme跳转，若不支持则复制链接
  // 动态添加o-graph
  // 支持添加自定义平台

  render(props: any) {

    return (
      <>
        <div>
          <button class="share-button" >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z' />
            </svg>
            Share
          </button>


          {
            !this.isMobile ?
              <dialog open class="share-menu">
                {Object.entries(this.shareOptions).map(([key, option]) => (
                  <button key={key} onClick={() => { }} class="media-button">
                    <div class="plus__line plus__line--v">
                      {Object.entries(option.shareMethods.pc).map(([key, method]) => (
                        <a href="#" class="plus__link" onClick={() => method({
                          props: props,
                          meta: {
                            isMobile: this.isMobile,
                            hasWebShareAPI: this.hasWebShareAPI,
                          }
                        })
                        }>{key}</a>
                      ))}
                    </div>
                    <div class="plus__line plus__line--h"></div>
                  </button>
                ))}
              </dialog> :
              <>
                <div class="menu-overlay"></div>
                <div class="bottom-menu">
                  <div class="menu-container">
                    {Array.from({ length: this.totalPages}).map((_, pageIndex) => (
                      <div class="menu-page">
                        {this.shareOptions.slice(pageIndex * 4, (pageIndex + 1) * 4).map((item, index) => (
                          <button key={index} class="menu-item" >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div class="menu-pagination">
                    {Array.from({ length: this.totalPages }).map((_, index) => (
                      <div
                        class={`pagination-dot ${index === this.currentPage ? 'active' : ''}`}
                        onClick={() => this.goToPage(index)}
                      ></div>
                    ))}
                  </div>
                </div>
              </>
          }

        </div>

      </>
    )
  }
}

