from django.shortcuts import render
from django.shortcuts import HttpResponse
# Create your views here.
import json
from urllib import request
from lxml import etree







class weather:
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
                icon = '<img src="/static/images/weather_icons/sun.png" class="img-responsive">'
            elif rain.find('云') != -1:
                icon = '<img src="/static/images/weather_icons/has_cloud.png" class="img-responsive">'
            elif rain.find('阴') != -1:
                icon = '<img src="/static/images/weather_icons/shadow.png" class="img-responsive">'
            elif rain.find('雨') != -1:
                if rain.find('小雨') != -1:
                    icon = '<img src="/static/images/weather_icons/small_rain.png" class="img-responsive">'
                elif rain.find('中雨') != -1:
                    icon = '<img src="/static/images/weather_icons/middle_rain.png" class="img-responsive">'
                elif rain.find('大雨') != -1:
                    icon = '<img src="/static/images/weather_icons/big_rain.png" class="img-responsive">'
                elif rain.find('暴雨') != -1:
                    icon = '<img src="/static/images/weather_icons/large_rain.png" class="img-responsive">'
                elif rain.find('雷') != -1:
                    icon = '<img src="/static/images/weather_icons/rain_lighting.png" class="img-responsive">'
                else:
                    icon = '<img src="/static/images/weather_icons/rain_lighting.png" class="img-responsive">'
            elif rain.find('雪') != -1:
                icon = '<img src="/static/images/weather_icons/snow.png" class="img-responsive">'
            else:
                icon = '<img src="/static/images/weather_icons/sun.png" class="img-responsive">'
            try:
                temperature_a = day.xpath('p[2]/span/text()')[0]
            except:
                temperature_a = '0℃'
            temperature_c = day.xpath('p[2]/i/text()')[0]
            temperature = temperature_a+'~'+temperature_c
            wind = day.xpath('p[3]/em/span[1]/@title')[0]
            wind_degree = day.xpath('p[3]/i/text()')[0]
            self.infos = []
            self.infos.append(date)
            self.infos.append(icon)
            self.infos.append(rain)
            self.infos.append(temperature)
            self.infos.append(wind)
            self.infos.append(wind_degree)
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
            print(area)
            return area


def index(request):
    if request.method == "POST":
        fp = open('E:/python_spider/area_code.json','r')

        headers = {'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '  
                        'Chrome/63.0.3239.108 Safari/537.36'}
        #weather.weather_dic = {}
        city = request.POST.get("city",None)
        #infos_io = infos_io(fp, city)
        try:
            area_code = infos_io(fp, city).parse_json()
        except:
            return render(request, "error.html", )
        url = 'http://www.weather.com.cn/weather/{}.shtml'.format(area_code)
        weather_dic = weather(url,headers).get_weather()
        print(weather_dic[0])
        fp.close()
        return render(request, "index.html", {"data": weather_dic,"city":city})
    return render(request,"index.html",)
