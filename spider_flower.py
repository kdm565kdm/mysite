from urllib import request
import re
import json


class beauty:
    def __init__(self, urls, headers):
        req = request.Request(url=urls, headers=headers)
        res = request.urlopen(req)
        html = res.read()
        html_code = html.decode('utf-8')
        self.srcs = []
        self.json_data = json.loads(html_code)
    def get_src(self):
        results =  self.json_data["results"]
        for result in results:
            tem = result['url']
            self.srcs.append(tem)
        return self.srcs

