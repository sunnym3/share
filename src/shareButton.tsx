import { h, tag, Component } from 'omi'
import cssString from './shareButton.css?raw'
import { generateQRCode } from './util/qrcode'
import { icons } from './util/svg'
import { captureElement, downloadScreenshot } from './util/screenshot'
import { access } from './util/api'


// 小红书ui
// 流量统计

type shareOption = {
  name: string,
  icon: {
    mobile: string,
    pc: string
  },
  shareMethods: {
    pc: (data: any) => void,
    mobile: {
      name: string,
      method: (data: any) => void
    }[]
  }
}

@tag('share-button')
export default class extends Component {

  static css = cssString

  private isMenuOpen = false
  private isMobile = false
  private hasWebShareAPI = false


  private dialogElement: HTMLDialogElement | null = null
  private shareButtonInnerElement: HTMLButtonElement | null = null
  private mediaButtons: HTMLLIElement[] = []
  private menuContainer: HTMLDivElement | null = null

  private menuOverlay: HTMLDivElement | null = null
  private bottomMenu: HTMLDivElement | null = null


  private currentPage = 0
  private totalPages = 0


  private webShareApiButtonCallback: (e: any) => void = (e: any) => { e };

  static propTypes = {
    name: String,
    url: String,
    media: String,
    other: String,
  }

  // attributeChangedCallback(name: string, oldValue: string, newValue: string) {
  //   if(name === 'other'){
  //     console.log('attributeChangedCallback other', newValue)


  //   }
  // }

  // 定义菜单项数据
  private shareOptions: shareOption[] = []
  private shareOptionsDefault: shareOption[] = [
    {
      name: '微信',
      icon: {
        mobile: icons.wechatMobile,
        pc: icons.wechatPc
      },
      shareMethods: {
        pc: async (data: any) => {
          try {
            await this.generateQRCode(data.props.url)
          } catch (error) {
            console.error('生成二维码失败:', error)
          }
        },
        mobile: [
          {
            name: '复制链接',
            method: async (data: any) => {
              this.copyToClipboard(data.props.url)
            }
          }
        ]
      }
    },
    {
      name: 'QQ',
      icon: {
        mobile: icons.qqMobile,
        pc: icons.qqPc
      },
      shareMethods: {
        pc: async (data: any) => {
          window.location.href = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(data.props.url)}&source=${encodeURIComponent(data.props.url)}&title=${encodeURIComponent("分享链接")}&pics=&summary=&desc=${encodeURIComponent("分享链接")}`
        },
        mobile: [
          {
            name: '复制并跳转',
            method: async (data: any) => {
              this.copyToClipboard(data.props.url)
              window.location.href = `mqq://`
            }
          }
        ]
      }
    },
    {
      name: 'QQ Zone',
      icon: {
        mobile: icons.qqZoneMobile,
        pc: icons.qqZonePc
      },
      shareMethods: {
        pc: async (data: any) => {
          const shareUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title=分享一个链接&desc=分享一个链接&summary=分享链接&site=测试站点'
          window.location.href = shareUrl.replace('{url}', encodeURIComponent(data.props.url))
        },
        mobile: [
          {
            name: '网页跳转',
            method: async (data: any) => {
              const shareUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title=分享一个链接&desc=分享一个链接&summary=分享链接&site=测试站点'
              window.location.href = shareUrl.replace('{url}', encodeURIComponent(data.props.url))
            }
          }
        ]
      }
    },
    {
      name: '微博',
      icon: {
        mobile: icons.weiboMobile,
        pc: icons.weiboPc
      },
      shareMethods: {
        pc: async (data: any) => {
          console.log(data)
          const title = '分享一个链接'
          window.location.href = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(data.props.url)}&title=${encodeURIComponent(title)}`
        },
        mobile: [
          {
            name: '复制链接',
            method: (data: any) => {
              this.copyToClipboard(data.props.url)
            }
          },
          {
            name: '跳转分享',
            method: (data: any) => {
              console.log(data)
              const title = '分享一个链接'
              window.location.href = `sinaweibo://sendweibo?show_keyboard=1&content=${encodeURIComponent(title + ' ' + data.props.url)}`
            }
          },
          {
            name: '网页分享',
            method: (data: any) => {
              console.log(data)
              const title = '分享一个链接'
              window.location.href = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(data.props.url)}&title=${encodeURIComponent(title)}`
            }
          }
        ]
      }
    },
    {
      name: 'linkedin',
      icon: {
        mobile: icons.linkedinMobile,
        pc: icons.linkedinPc
      },
      shareMethods: {
        pc: async (data: any) => {
          window.location.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(data.props.url)}&title=${encodeURIComponent(data.props.url)}`
        },
        mobile: [
          {
            name: '网页分享',
            method: async (data: any) => {
              window.location.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(data.props.url)}&title=${encodeURIComponent(data.props.url)}`
            }
          },
          {
            name: '跳转分享',
            method: async (data: any) => {
              window.location.href = `linkedin://share?url=${encodeURIComponent(data.props.url)}`
            }
          }
        ]
      }
    },
    {
      name: 'facebook',
      icon: {
        mobile: icons.facebookMobile,
        pc: icons.facebookPc
      },
      shareMethods: {
        pc: async (data: any) => {
          let metaArr = [
            'og:url', data.props.url,
            'og:title', 'this is title',
            'og:description', 'this is desc',
            'og:type', 'website'
          ]
          let metaParams = metaArr.toString()
          window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(`${data.props.url}/share/new?meta=${metaParams}`))
        },
        mobile: [
          {
            name: '跳转分享',
            method: async (data: any) => {
              data
              window.location.href = `fb://feed`
            }
          }
        ]
      }
    },
    {
      name: 'twitter',
      icon: {
        mobile: icons.twitterMobile,
        pc: icons.twitterPc
      },
      shareMethods: {
        pc: async (data: any) => {
          window.open(`https://twitter.com/intent/tweet?text=` + encodeURIComponent(data.props.url))
        },
        mobile: [
          {
            name: '跳转分享',
            method: (data: any) => {
              window.open(`https://twitter.com/intent/tweet?text=` + encodeURIComponent(data.props.url))
            }
          }
        ]
      }
    }
  ]



  private copyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '0'

    // 找到当前活动的dialog
    const activeDialog = this.shareButtonInnerElement?.querySelector('share-method-mobile-dialog')
    if (activeDialog) {
      activeDialog.appendChild(textArea)
    } else {
      document.body.appendChild(textArea)
    }

    textArea.focus()
    textArea.select()

    let success = false
    try {
      success = document.execCommand('copy')
    } catch (err) {
      console.error('复制失败:', err)
    }

    // 移除临时输入框
    textArea.remove()

    // 显示复制结果提示
    const toast = document.createElement('div')
    toast.textContent = success ? text : '复制失败，请手动复制'
    toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 999999;'
    document.body.appendChild(toast)
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 2000)

    return success
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
    // 获取 share-button 元素
    const shareButtonElement = document.querySelector('share-button')
    if (shareButtonElement?.shadowRoot) {
      if (!this.isMobile) {
        this.shareButtonInnerElement = shareButtonElement.shadowRoot.querySelector('.share-button-inner')
        console.log(this.shareButtonInnerElement)
        if (this.shareButtonInnerElement) {
          // 设置初始状态
          this.dialogElement = shareButtonElement.shadowRoot.querySelector('dialog')
          this.mediaButtons = Array.from(this.dialogElement?.querySelectorAll('li') || []) as HTMLLIElement[]

          console.log(this.dialogElement)
          console.log(this.mediaButtons)

          this.shareButtonInnerElement.addEventListener('click', () => {
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


          this.mediaButtons?.forEach((mediaButton) => {
            mediaButton.addEventListener('animationend', () => {
              console.log('animationend');
              (mediaButton as HTMLElement).style.opacity = '1'
              mediaButton.classList.remove('initial-animation');
              (mediaButton as HTMLElement).style.animationDelay = `0s`
            })

          })
        }
      } else {
        this.shareButtonInnerElement = shareButtonElement.shadowRoot.querySelector('.share-button-inner')
        console.log(this.shareButtonInnerElement)
        if (this.shareButtonInnerElement) {

          this.menuOverlay = shareButtonElement.shadowRoot.querySelector('.menu-overlay')
          this.bottomMenu = shareButtonElement.shadowRoot.querySelector('.bottom-menu')
          // const webShareApiButton = shareButtonElement.shadowRoot.querySelector('.web-share-api-button')
          this.menuContainer = shareButtonElement.shadowRoot.querySelector('.menu-container')


          this.webShareApiButtonCallback = async (props: any) => {
            console.log('click')
            if (this.hasWebShareAPI) {
              this.isMenuOpen = !this.isMenuOpen
              this.menuOverlay?.classList.remove('active')
              this.bottomMenu?.classList.remove('active')

              const shareData = {
                title: '分享一个链接',
                text: '分享一个链接',
                url: props.url
              }
              await navigator.share(shareData)
            } else {
              console.log('not support')

              //toast not support
              const toast = document.createElement('div')
              toast.textContent = 'not support'
              toast.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 4px; z-index: 999999;'
              document.body.appendChild(toast)
              setTimeout(() => {
                document.body.removeChild(toast)
              }, 2000)
            }
          }

          this.shareButtonInnerElement.addEventListener('click', () => {
            console.log('click')
            this.isMenuOpen = !this.isMenuOpen
            this.menuOverlay?.classList.add('active')
            this.bottomMenu?.classList.add('active')
          })

          this.menuOverlay?.addEventListener('click', () => {
            this.isMenuOpen = !this.isMenuOpen
            this.menuOverlay?.classList.remove('active')
            this.bottomMenu?.classList.remove('active')
          })

          // 添加触摸事件监听
          if (this.menuContainer) {
            this.menuContainer.addEventListener('touchstart', this.handleTouchStart as EventListener)
            this.menuContainer.addEventListener('touchmove', this.handleTouchMove as EventListener)
            this.menuContainer.addEventListener('touchend', this.handleTouchEnd as EventListener)
          }

          // 添加分页点点击事件
          const paginationDots = shareButtonElement.shadowRoot.querySelectorAll('.pagination-dot')
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
        }
      })

      // 创建二维码弹窗
      const dialog = document.createElement('dialog')
      dialog.style.cssText = 'border-radius: 8px; border:none; position: relative;background: transparent;'

      const qrCodeContainer = document.createElement('div')
      qrCodeContainer.classList.add('qr-code-container')


      const qrCode = document.createElement('img')
      qrCode.src = qrCodeUrl
      qrCode.classList.add('qr-code')

      const mixLayer = document.createElement('div')
      mixLayer.classList.add('mix-layer')

      const closeButton = document.createElement('button')
      closeButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
      closeButton.classList.add('qr-code-close-button')
      closeButton.onclick = () => {
        qrCodeContainer.style.transform = 'scale(0)'
        setTimeout(() => {
          dialog.close()
        }, 300)
      }

      qrCodeContainer.addEventListener('mouseenter', () => {
        closeButton.style.opacity = '1'
        qrCode.style.filter = 'brightness(0.7)'
      })
      qrCodeContainer.addEventListener('mouseleave', () => {
        closeButton.style.opacity = '0'
        qrCode.style.filter = 'brightness(1)'
      })

      qrCodeContainer.appendChild(mixLayer)
      qrCodeContainer.appendChild(qrCode)
      qrCodeContainer.appendChild(closeButton)
      dialog.appendChild(qrCodeContainer)
      this.dialogElement?.appendChild(dialog)

      dialog.showModal()
      // 触发重排以启动动画
      qrCodeContainer.offsetHeight
      qrCodeContainer.style.transform = 'scale(1)'
    } catch (error) {
      throw error
    }
  }

  private showScreenshotPreview = (screenshotResult: { base64: string, width: number, height: number }) => {

    const dialog = document.createElement('dialog');
    dialog.classList.add('screenshot-preview-dialog');

    const previewContainer = document.createElement('div');
    previewContainer.classList.add('screenshot-preview-container');

    // 添加点击事件阻止冒泡
    dialog.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const image = document.createElement('img');
    image.src = screenshotResult.base64;
    image.classList.add('screenshot-preview-image');

    // 计算初始缩放比例
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = 450;
    const widthRatio = maxWidth / screenshotResult.width;
    const heightRatio = maxHeight / screenshotResult.height;
    const initialScale = Math.min(widthRatio, heightRatio);

    // 设置初始尺寸和位置
    image.style.width = `${screenshotResult.width}px`;
    image.style.height = `${screenshotResult.height}px`;
    image.style.transformOrigin = 'center center';
    image.style.position = 'absolute';
    image.style.transform = `scale(${initialScale})`;

    // 添加触摸事件处理
    let initialDistance = 0;
    let currentScale = initialScale;
    const minScale = initialScale * 0.5;
    const maxScale = initialScale * 2;

    // 拖动相关变量
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX ;
        startY = e.touches[0].clientY ;
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        currentX = e.touches[0].clientX ;
        currentY = e.touches[0].clientY ;

        let deltaX = currentX - startX;
        let deltaY = currentY - startY;
        image.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${currentScale})`;
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (initialDistance) {
          // 降低缩放灵敏度
          const scale = 1 + (currentDistance / initialDistance - 1) * 0.05;
          const newScale = Math.min(Math.max(currentScale * scale, minScale), maxScale);

          // 使用 transform 进行缩放和位移
          image.style.transform = `scale(${newScale})`;
          currentScale = newScale;
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      initialDistance = 0;
    };

    image.addEventListener('touchstart', handleTouchStart);
    image.addEventListener('touchmove', handleTouchMove, { passive: false });
    image.addEventListener('touchend', handleTouchEnd);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('screenshot-preview-image-container');
    imageContainer.appendChild(image);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('screenshot-preview-buttons');

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('screenshot-download-button');
    downloadButton.textContent = '下载';
    downloadButton.onclick = () => {
      downloadScreenshot(screenshotResult.base64, 'page-screenshot.png');
      dialog.close();  
    };

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('screenshot-cancel-button');
    cancelButton.textContent = '取消';
    cancelButton.onclick = () => {
      dialog.close();
    };

    buttonContainer.appendChild(downloadButton);
    buttonContainer.appendChild(cancelButton);

    previewContainer.appendChild(imageContainer);
    previewContainer.appendChild(buttonContainer);
    dialog.appendChild(previewContainer);

    this.shareButtonInnerElement?.appendChild(dialog)
    dialog.showModal();

    // 点击对话框外部关闭
    // dialog.addEventListener('click', (e) => {
    //   if (e.target === dialog) {
    //     dialog.close();
    //   }
    // });
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


  private shareMethodDialogMobile = (methods: any, data: any) => {

    const dialog = document.createElement('dialog')
    dialog.classList.add('share-method-mobile-dialog')


    const dialogHeader = document.createElement('div')
    dialogHeader.classList.add('share-method-mobile-dialog-header')


    const headerContent = document.createElement('div')
    headerContent.classList.add('share-method-mobile-dialog-header-content')
    headerContent.textContent = '选择分享方式'


    const closeButton = document.createElement('button')
    closeButton.textContent = 'x'
    closeButton.classList.add('share-method-mobile-dialog-header-close-button')
    closeButton.onclick = () => dialog.close()

    dialogHeader.appendChild(headerContent)
    dialogHeader.appendChild(closeButton)


    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('share-method-mobile-dialog-button-container')

    Object.entries(methods).forEach(([_, method]: [string, any]) => {
      const button = document.createElement('button')
      button.textContent = method.name
      button.classList.add('share-method-mobile-dialog-button')
      button.onclick = () => {
        method.method(data)
        dialog.close()
      }
      buttonContainer.appendChild(button)
    })


    dialog.appendChild(dialogHeader)
    dialog.appendChild(buttonContainer)


    // document.body.appendChild(dialog)
    this.shareButtonInnerElement?.appendChild(dialog)
    dialog.showModal()
  }

  private formatTimeNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  
  render(props: any) {
    const media = props.media ? JSON.parse(props.media) : null
    let otherOption = null
    if (props.other) {
      try {
        const parsedOther = JSON.parse(props.other)
        console.log('Parsed other:', parsedOther)
        if (parsedOther && typeof parsedOther === 'object') {
          const processedOption = { ...parsedOther }
          if (parsedOther.icon) {
            processedOption.icon.mobile = parsedOther.icon.mobile
            processedOption.icon.pc = parsedOther.icon.pc
          }
          if (parsedOther.shareMethods) {
            if (parsedOther.shareMethods.pc) {
              processedOption.shareMethods.pc = new Function('return ' + parsedOther.shareMethods.pc)()
            }
            if (parsedOther.shareMethods.mobile) {
              processedOption.shareMethods.mobile = parsedOther.shareMethods.mobile.map((method: any) => ({
                ...method,
                method: new Function('return ' + method.method)()
              }))
            }
          }
          otherOption = processedOption
        }
      } catch (error) {
        console.error('Error parsing other option:', error)
        console.error('Raw other prop:', props.other)
      }
    }
    this.shareOptions = media
      ? this.shareOptionsDefault.filter((option) => media.includes(option.name))
      : this.shareOptionsDefault
    this.shareOptions = this.shareOptions.concat(otherOption ? [otherOption] : [])
    this.totalPages = Math.ceil(this.shareOptions.length / 5)


    props.name = document.title
    props.url = window.location.href

    return (
      <>
        <div>
          <button class="share-button-inner" >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z' />
            </svg>
          </button>
          {
            !this.isMobile ?
              <dialog open class="share-menu">
                {Object.entries(this.shareOptions).map(([key, option]) => (
                  <li key={key} onClick={() => {
                    option.shareMethods.pc({
                      props: props,
                      meta: {
                        isMobile: this.isMobile,
                        hasWebShareAPI: this.hasWebShareAPI,
                      }
                    })
                    access({
                      mediaName: option.name,
                      url: props.url,
                      accessTime: this.formatTimeNow(),
                      accessLocation: "127.0.0.1",
                    })
                  }} >
                    <a href="#" >
                      <i innerHTML={option.icon.pc}></i>
                    </a>
                  </li>
                ))}
              </dialog> :
              <>
                <div class="menu-overlay"></div>
                <div class="bottom-menu">
                  <div class="menu-header">
                    <div class="header-content-intro">
                      分享页面
                    </div>
                    <div class="header-content-href">
                      {props.url}
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="menu-container">
                    {Array.from({ length: this.totalPages }).map((_, pageIndex) => (
                      <div class="menu-page">
                        {this.shareOptions.slice(pageIndex * 5, (pageIndex + 1) * 5).map((item, index) => (
                          <button key={index} class="menu-item" onClick={() => {
                            this.shareMethodDialogMobile(item.shareMethods.mobile, {
                              props: props,
                              meta: {
                                isMobile: this.isMobile,
                                hasWebShareAPI: this.hasWebShareAPI,
                              }
                            })

                            access({
                              mediaName: item.name,
                              url: props.url,
                              accessTime: this.formatTimeNow(),
                              accessLocation: "127.0.0.1",
                            })
                          }

                          }>
                            <div class="menu-item-wrapper">
                              <div class="menu-item-icon">
                                <div style="width: 30px; height: 30px;" innerHTML={item.icon.mobile}></div>
                              </div>
                              <div class="menu-item-name">{item.name}</div>
                            </div>
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

                  <div class="divider"></div>
                  <div class="other-function-board">
                    <button class="function-button" onclick={() => {
                      this.copyToClipboard(props.url)
                    }} >
                      <div class="menu-item-wrapper">
                        <div class="menu-item-icon">
                          <div style="width: 30px; height: 30px;" innerHTML={icons.copyMobile}></div>
                        </div>
                        <div class="menu-item-name">复制链接</div>
                      </div>
                    </button>
                    <button class="function-button web-share-api-button" onclick={() => this.webShareApiButtonCallback(props)} >
                      <div class="menu-item-wrapper" >
                        <div class="menu-item-icon">
                          <div style="width: 30px; height: 30px;" innerHTML={icons.webShareApi}></div>
                        </div>
                        <div class="menu-item-name">web share</div>
                      </div>
                    </button>
                    <button class="function-button" onclick={async () => {
                      try {
                        this.isMenuOpen = !this.isMenuOpen;
                        this.menuOverlay?.classList.remove('active');
                        this.bottomMenu?.classList.remove('active');
                        const element = document.querySelector('.share-plugin-screenshot') as HTMLElement;
                        if (element) {
                          const result = await captureElement(element, {
                            scale: 2,
                            backgroundColor: '#ffffff'
                          });
                          this.showScreenshotPreview(result);
                        }
                      } catch (error) {
                        console.error('截图失败:', error);
                      }
                    }}>
                      <div class="menu-item-wrapper">
                        <div class="menu-item-icon">
                          <div style="width: 30px; height: 30px;" innerHTML={icons.screenshotMobile}></div>
                        </div>
                        <div class="menu-item-name">截取元素</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
          }

        </div>

      </>
    )
  }
}

