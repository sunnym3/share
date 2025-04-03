import { tag, WeElement, h, extractClass } from 'omi'
import * as css from './index.scss'

interface Props {
  title?: string
  text?: string
  url?: string
  media?: string
}

@tag('share-component')
export default class ShareComponent extends WeElement<Props> {
  static css = css.default

  static defaultProps = {
    title: '',
    text: '',
    url: window.location.href,
    media: ''
  }

  private shareOptions = {
    facebook: {
      name: 'Facebook',
      icon: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>`,
      methods: {
        share: (data: any) => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`)
        },
        feed: (data: any) => {
          window.open(`https://www.facebook.com/dialog/feed?app_id=YOUR_APP_ID&link=${encodeURIComponent(data.url)}&picture=${encodeURIComponent(data.media)}&name=${encodeURIComponent(data.title)}&description=${encodeURIComponent(data.text)}`)
        }
      }
    },
    twitter: {
      name: 'Twitter',
      icon: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>`,
      methods: {
        tweet: (data: any) => {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}`)
        }
      }
    },
    linkedin: {
      name: 'LinkedIn',
      icon: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>`,
      methods: {
        share: (data: any) => {
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`)
        }
      }
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>`,
      methods: {
        share: (data: any) => {
          window.open(`whatsapp://send?text=${encodeURIComponent(data.title + ' ' + data.url)}`)
        },
        web: (data: any) => {
          window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(data.title + ' ' + data.url)}`)
        }
      }
    }
  }

  private isMenuOpen = false
  private activePlatform: string | null = null

  private toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen
    this.update()
  }

  private togglePlatform = (platform: string) => {
    this.activePlatform = this.activePlatform === platform ? null : platform
    this.update()
  }

  private handleShare = (platform: string, method: string) => {
    const data = {
      title: this.props.title,
      text: this.props.text,
      url: this.props.url,
      media: this.props.media
    }
    this.shareOptions[platform].methods[method](data)
    this.isMenuOpen = false
    this.activePlatform = null
    this.update()
  }

  render(props: Props) {
    return (
      <div class="share-container">
        <button class="share-button" onClick={this.toggleMenu}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
          Share
        </button>
        
        {this.isMenuOpen && (
          <div class="share-menu">
            {Object.entries(this.shareOptions).map(([platform, options]) => (
              <div key={platform}>
                <div 
                  class="platform-item" 
                  onClick={() => this.togglePlatform(platform)}
                >
                  <div dangerouslySetInnerHTML={{ __html: options.icon }} />
                  <span>{options.name}</span>
                </div>
                {this.activePlatform === platform && (
                  <div class="methods-container">
                    {Object.keys(options.methods).map(method => (
                      <div 
                        key={method}
                        class="method-item"
                        onClick={() => this.handleShare(platform, method)}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
} 