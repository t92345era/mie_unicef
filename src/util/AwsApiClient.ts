import { catchError, map, Observable, of } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { User } from "../redux/modules/user";

export class AwsApiClient {

  constructor() { }

  private static readonly URL_BASE: string = "https://ixnxniutwi.execute-api.ap-northeast-1.amazonaws.com";

  /**
   * ユーザー一覧の取得
   * @param addAll 全員を追加するかどうか
   * @param deliOnly メール配信者だけを取得するか
   * @returns レスポンス
   */
  static getUsers(addAll: boolean, deliOnly: boolean, apikey: string): Observable<AjaxResponse<any>> {
    return ajax.post(`${AwsApiClient.URL_BASE}/users`,
      {
        "deliOnly": deliOnly,
        "addAll": addAll
      },
      {
        'Content-Type': 'application/json',
        'x-api-key': apikey,
      })
  }

  /**
   * ユーザーの登録更新
   * @param deliOnly メール配信者だけを取得するか
   * @returns レスポンス
   */
  static insUpUser(user: User, apikey: string): Observable<AjaxResponse<any>> {
    return ajax.post(`${AwsApiClient.URL_BASE}/users`,
      {
        "updateUser": user
      },
      {
        'Content-Type': 'application/json',
        'x-api-key': apikey,
      })
  }


  /**
   * ユーザーの削除
   * @param user 削除するユーザー
   * @param apikey APIKEY
   * @returns レスポンス
   */
   static deleteUser(user: User, apikey: string): Observable<AjaxResponse<any>> {
    return ajax.post(`${AwsApiClient.URL_BASE}/users`,
      {
        "deleteUser": user
      },
      {
        'Content-Type': 'application/json',
        'x-api-key': apikey,
      })
  }

  /**
    * メール送受信履歴の取得
    * @param deliOnly メール配信者だけを取得するか
    * @returns レスポンス
    */
  static mailHis(srKbn: string, apikey: string): Observable<any> {
    //console.log("mailHis srKbn=" + srKbn);
    return ajax.post(`${AwsApiClient.URL_BASE}/mail/hist`,
      {
        "srKbn": srKbn
      },
      {
        'Content-Type': 'application/json',
        'x-api-key': apikey,
      })


    return of({
      response: Array.from(Array(5), (v, k) => ({
        pkey: "000" + k,
        ems: k,
        subject: "メール件名" + k,
        html: "メール本文<div>あああああ</div>",
        from: "test1@mail.com",
        fromName: srKbn + "テスト 太郎" + k,
        timeDisp: "3/29 23:29",
        to: [
          {
            'address': "info_mie@team-mie.net",
            'name': "送信先名TEST1"
          },
          {
            'address': "info_mie@team-mie.net",
            'name': "送信先名TEST2"
          }
        ],
        srKbn: srKbn
      }))
    });
  }

  /**
    * メール送受信履歴の取得（１件）
    * @param deliOnly メール配信者だけを取得するか
    * @returns レスポンス
    */
  static mailHisOne(key: { [index: string]: string; }, apikey: string): Observable<any> {

    //console.log("key", key);
    //console.log("apikey", apikey);
    return ajax.post(`${AwsApiClient.URL_BASE}/mail/hist`, key,
      {
        'Content-Type': 'application/json',
        'x-api-key': apikey,
      })


    // return of({
    //   response : Array.from(Array(1), (v, k) => ({
    //     pkey: "000" + k,
    //     ems: key["ems"],
    //     subject: "メール件名" + k,
    //     srKbn: key["srKbn"],
    //     html: "メール本文<div>あああああ</div><br/>改行",
    //     from: "test1@mail.com",
    //     fromName: "テスト 太郎" + k, 
    //     to: [
    //       {
    //         'address': "info_mie@team-mie.net",
    //         'name': "送信先名TEST1"
    //       },
    //       {
    //         'address': "info_mie@team-mie.net",
    //         'name': "送信先名TEST2"
    //       }
    //     ],
    //     timeDisp: "3/29 23:29",
    //   }))
    // });
  }

  /**
     * メール送受信履歴の取得（１件）
     * @param deliOnly メール配信者だけを取得するか
     * @returns レスポンス
     */
  static authCheck(apkey: string): Observable<boolean> {
    //console.log("apkey", apkey);
    return ajax.post(`${AwsApiClient.URL_BASE}/mail/hist`, { srKbn: "S", ems: 9999 },
      {
        'Content-Type': 'application/json',
        'x-api-key': apkey,
      })
      .pipe(
        map(rs => rs.status == 200),
        catchError(err => {
          return of(false);
        })
      );
  }

  /**
   * メール送信
   * @param message メッセージ
   * @returns レスポンス
   */
  static sendMail(message: MailMessage, apikey: string): Observable<AjaxResponse<any>> {
    //console.log("start send");
    return ajax.post(`${AwsApiClient.URL_BASE}/mail/send`,
      message,
      {
        'Content-Type': 'application/json',
        'x-api-key': apikey,
      })
  }

}


export interface MailMessage {
  to: {
    address: string,
    name: string
  }[],
  allSend: boolean,
  subject: string,
  body: string
}