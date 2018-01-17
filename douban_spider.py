from urllib import request
from lxml import etree
import re
import ssl

#全局取消证书验证
ssl._create_default_https_context = ssl._create_unverified_context
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                             'Chrome/63.0.3239.108 Safari/537.36'}
class douban_movie:
    def __init__(self, urls, headers):
        req = request.Request(url=urls, headers=headers)
        res = request.urlopen(req)
        html = res.read()
        html_code = html.decode('utf-8')
        selector = etree.HTML(html_code)
        self.contents = selector.xpath('//ol/li')
        self.contents_detail = []
    def get_movie_info(self):
        tem = {}
        #tem = []
        for content in self.contents:
            href = content.xpath('div/div[1]/a/@href')[0]
            img_src = content.xpath('div/div[1]/a/img/@src')[0]
            title = content.xpath('div/div[2]/div/a/span[1]/text()')[0]
            relevant_info = content.xpath('div/div[2]/div/p/text()')[1].strip()
            score = content.xpath('div/div[2]/div/div/span[2]/text()')[0]
            try:
                summary = content.xpath('div/div[2]/div/p[2]/span/text()')[0]
            except:
                summary = "无概览。"
            tem["href"] = href
            tem["img_src"] = img_src
            tem["title"] = title
            tem["relevant_info"] = relevant_info
            tem["score"] = score
            tem["summary"] = summary
            #tem.append(href)
            #tem.append(img_src)
            #tem.append(title)
            #tem.append(relevant_info)
            #tem.append(score)
            #tem.append(summary)

            self.contents_detail.append(tem)
            tem = {}
            #tem = []
        return self.contents_detail

    



