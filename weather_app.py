import json
from urllib import request
from lxml import etree
import os

currentpath = os.getcwd()
path = currentpath+"/area_code.json"



class weather_info:
    def __init__(self, url, headers):
        self.url = url
        self.headers = headers
        self.weather_dic = []
        self.infos = []
    def get_weather(self):
        req = request.Request(url=self.url,headers=self.headers)
        res = request.urlopen(req)
        html = res.read()
        html_code = html.decode('utf-8')
        selector = etree.HTML(html_code)
        days = selector.xpath('//*[@id="7d"]/ul/li')
        for day in days:
            date = day.xpath('h1/text()')[0].strip()
            rain = day.xpath('p[1]/text()')[0]
            if rain.find('晴') != -1:
                bg_weather = 'sun'
                icon = '<img src="/static/images/weather_icons/sun.png" class="img-responsive">'
            elif rain.find('云') != -1:
                bg_weather = 'cloud'
                icon = '<img src="/static/images/weather_icons/has_cloud.png" class="img-responsive">'
            elif rain.find('阴') != -1:
                bg_weather = 'shadow'
                icon = '<img src="/static/images/weather_icons/shadow.png" class="img-responsive">'
            elif rain.find('雨') != -1:
                if rain.find('小雨') != -1:
                    bg_weather = 'rain'
                    icon = '<img src="/static/images/weather_icons/small_rain.png" class="img-responsive">'
                elif rain.find('中雨') != -1:
                    bg_weather = 'rain'
                    icon = '<img src="/static/images/weather_icons/middle_rain.png" class="img-responsive">'
                elif rain.find('大雨') != -1:
                    bg_weather = 'rain'
                    icon = '<img src="/static/images/weather_icons/big_rain.png" class="img-responsive">'
                elif rain.find('暴雨') != -1:
                    bg_weather = 'rain'
                    icon = '<img src="/static/images/weather_icons/large_rain.png" class="img-responsive">'
                elif rain.find('雷') != -1:
                    bg_weather = 'rain'
                    icon = '<img src="/static/images/weather_icons/rain_lighting.png" class="img-responsive">'
                else:
                    bg_weather = 'rain'
                    icon = '<img src="/static/images/weather_icons/rain_lighting.png" class="img-responsive">'
            elif rain.find('雪') != -1:
                bg_weather = 'snow'
                icon = '<img src="/static/images/weather_icons/snow.png" class="img-responsive">'
            else:
                bg_weather = 'sun'
                icon = '<img src="/static/images/weather_icons/sun.png" class="img-responsive">'
            temperature_c = day.xpath('p[2]/i/text()')[0]
            try:
                temperature_a = day.xpath('p[2]/span/text()')[0]
            except:
                temperature_a = temperature_c


            temperature = temperature_a+'\t~\t'+temperature_c
            tem = temperature.strip('℃')
            max_tem_s = tem.split('~')[0]
            max_tem = max_tem_s.split('℃')[0].strip()
            min_tem = tem.split('~')[1].strip()
            wind = day.xpath('p[3]/em/span[1]/@title')[0]
            wind_degree = day.xpath('p[3]/i/text()')[0]
            self.infos = []
            self.infos.append(date)
            self.infos.append(icon)
            self.infos.append(rain)
            self.infos.append(temperature)
            self.infos.append(wind)
            self.infos.append(wind_degree)
            
            self.infos.append( max_tem)
            self.infos.append(min_tem)
            self.infos.append(bg_weather)
            self.weather_dic.append(self.infos)
        return self.weather_dic

class infos_io():
    def __init__(self, fp, city):
        self.fp = fp
        self.city = city
    def parse_json(self):
        json_data = self.fp.read()
        content = json.loads(json_data)
        if isinstance(self.city,str) == True:
            area = content[self.city]
            return area
