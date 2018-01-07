from django.shortcuts import render
from django.shortcuts import HttpResponse
# Create your views here.
import json
from urllib import request
from lxml import etree
#import types

headers = {'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '  
                        'Chrome/63.0.3239.108 Safari/537.36'}


weather_dic = {}
infos = []

def get_weather(url):
    req = request.Request(url=url,headers=headers)
    res = request.urlopen(req)
    html = res.read()
    html_code = html.decode('utf-8')
    selector = etree.HTML(html_code)
    days = selector.xpath('//*[@id="7d"]/ul/li')
    for day in days:
        date = day.xpath('h1/text()')[0].strip()
        rain = day.xpath('p[1]/text()')[0]
        try:
            temperature_a = day.xpath('p[2]/span/text()')[0]
        except:
            temperature_a = '0℃'
        temperature_c = day.xpath('p[2]/i/text()')[0]
        temperature = temperature_a+'~'+temperature_c
        wind = day.xpath('p[3]/em/span[1]/@title')[0]
        wind_degree = day.xpath('p[3]/i/text()')[0]
        infos = []
        infos.append(date)
        infos.append(rain)
        infos.append(temperature)
        #temp = {wind:wind_degree,}
        infos.append(wind)
        infos.append(wind_degree)
        weather_dic[date] = infos

def weather(city):
    fp = open('E:/python_spider/area_code.json','r')
    json_data = fp.read()
    content = json.loads(json_data)
    #word = input('请输入地点：')
    word = city
    if isinstance(word,str) == True:
        area = content[word]
        print(area)
        url = 'http://www.weather.com.cn/weather/{}.shtml'.format(area)
        print(url)
        get_weather(url)
    fp.close()

def index(request):
    global weather_dic
    if request.method == "POST":
        weather_dic = {}
        city = request.POST.get("city",None)
        weather(city)
    return render(request,"index.html",{"data":weather_dic.items()})