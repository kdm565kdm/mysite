

from urllib import request
from lxml import etree
import json
import models
class case_area_code:
    def __init__(self):
        self.headers = {
                'Cookie':'_T_WM=33daf456171587d4553d73b862cd0432; TMPTOKEN=jG5m7PBCkqfoG5JLEij3194XDlw9IXaatLAIsBhHS0nel4MCQXqd1iegNmJsmwi7; SUB=_2A253TZQ9DeRhGeVP61sU9S7Fwz2IHXVUsTx1rDV6PUJbkdBeLRKhkW1NTUhcAy050srTnhHkzRbrwLBcojIOrpC0; SUHB=0qjEGaitW45bwv; SCF=Al9_WTOOdwM3Mg4IvBcNFWWMeGCcrUyiyu-UmRbNv2GsmsYsJKzvJDxoWK44l9bu2jkO-lm-qt5v2VW_uKvp4MY.; SSOLoginState=1514792046; M_WEIBOCN_PARAMS=luicode%3D20000174%26lfid%3Dhotword%26featurecode%3D20000320%26uicode%3D20000318; H5_INDEX=0_friend; H5_INDEX_TITLE=%E5%A5%BD%E5%8F%8B%E5%9C%88%20',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
                'Connection':'keep-alive'
                }
        self.url = 'https://my.oschina.net/joanfen/blog/140364'
    def get_info(url):
        req = request.Request(url=url,headers=headers)
        res = request.urlopen(req)
        html = res.read()
        html_code = html.decode('utf-8')
        selector = etree.HTML(html_code)
        provinces_names = selector.xpath('//div[@class="BlogContent clearfix"]/h4/text()')
        areas_infos = selector.xpath('//div[@class="BlogContent clearfix"]/text()')
        areas_infos = areas_infos[3:]
    
        for info in areas_infos:
            tem = info.lstrip()
            tem = info.rstrip(' \n')
            tem = tem.split('=')
            if tem[0] != '':
                code_t = tem[0].strip()
                name_t = tem[1]
                #dicts2[name] = code
                models.city_code.objects.create(name=name_t, code=code_t)
        models.city_code.objects.create(name='北京', code='101010100')
        print('完成抓取')

#dicts = {}
#dicts2 = {}




