 /**
   * Returns response http of url.
   *
   * @param body        - Params send in body of the request
   * @param url         - Url of the request
   * @param method      - Http method of the request 
   *                        DEFAULT - POST
   * 
   * @returns Return a object with the data of the response
   * 
   */
export class http{

  static async fetchJSON(body: Object, url: string, method: string = 'POST'): Promise<any> {
  
    const response = await window.fetch(url, {
      method: method,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return response.ok? data:false;
  }
}