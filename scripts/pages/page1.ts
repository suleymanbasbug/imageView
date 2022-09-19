import Page1Design from 'generated/pages/page1';
import Label from '@smartface/native/ui/label';
import { Route, Router } from '@smartface/router';
import { styleableComponentMixin } from '@smartface/styling-context';
import { i18n } from '@smartface/i18n';
import axios from 'axios'
class StyleableLabel extends styleableComponentMixin(Label) {}

export default class Page1 extends Page1Design {
  private disposeables: (() => void)[] = [];
  access_token:string = '';
  constructor(private router?: Router, private route?: Route) {
    super({});
  }
  buildQueryParams = (query: { [key: string]: string | number | boolean }) => {
    return Object.keys(query).filter(key => query[key]).map((key) => `${key}=${encodeURIComponent(query[key])}`).join('&');
};
  login(){
    const res =  axios(`https://auth-smartapps.smartface.io/auth/realms/selfservice/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: this.buildQueryParams({
                client_id:'selfservice-app',
                client_secret: '5Gsty1RWb2UIHaWkoDA3SBHnKXbAoJYD',
                username:'fuat.guzel@smartface.io',
                password:'12345678',
                grant_type:'password'
            })
        }).then(res=> this.access_token = res.data.access_token).catch(e=>console.log(e))
        
  }

  defaultHeaders(){
    return {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json'
    };
  }

  setImage (value:string){
      this.imageView1.loadFromUrl({
        url: value,
        headers: this.defaultHeaders(),
        fade: !this.imageView1.image,
        useHTTPCacheControl: true,
        android: {
            useMemoryCache: false,
            useDiskCache: false
        },
        onSuccess: () => {
            console.log('onSuccess')
        },
        onFailure: () => {
            console.log('onFailure')
        }
      })
  }

  /**
   * @event onShow
   * This event is called when a page appears on the screen (everytime).
   */
  onShow() {
    super.onShow();
  }
  /**
   * @event onLoad
   * This event is called once when page is created.
   */
  onLoad() {
    super.onLoad();
    this.headerBar.leftItemEnabled = false;
    //this.login();
    console.log(this.access_token)
    setTimeout(() => {
        this.setImage('https://smartapps-user.smartface.io/user/profile-photo');
    }, 3000);
  }

  onHide(): void {
    this.dispose();
  }

  dispose(): void {
    this.disposeables.forEach((item) => item());
  }
}
