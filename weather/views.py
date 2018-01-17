from django.shortcuts import render
from django.shortcuts import HttpResponse
# Create your views here.

import json
from weather_app import weather_info, infos_io
from spider_flower import beauty
import os

currentpath = os.getcwd()
path = currentpath+"/area_code.json"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                             'Chrome/63.0.3239.108 Safari/537.36'}

def weather(request):
    fp = open(path,'r',encoding="gb18030")
 
    if request.method == "POST":
        city = request.POST.get("city", None)
        try:
            area_code = infos_io(fp, city).parse_json()
        except:
            return_json = {'city':'未找到该城市', 'detail':'error'}
            return HttpResponse(json.dumps(return_json), content_type='application/json')
        url = 'http://www.weather.com.cn/weather/{}.shtml'.format(area_code)
        weather_dic = weather_info(url,headers).get_weather()
        fp.close()
        return_json = {'city':city, 'detail':weather_dic}
        return HttpResponse(json.dumps(return_json), content_type='application/json')
    print('a')
    return render(request,"weather.html",)


def beautiful(request):
    #beauty_url = 'http://gank.io/api/data/%E7%A6%8F%E5%88%A9/10/0'
    #beauty_cursor = 0
    if request.method == "POST":
        page = request.POST.get("page", None)
        beauty_url = 'http://gank.io/api/data/%E7%A6%8F%E5%88%A9/10/'+page
        srcs = beauty(beauty_url, headers).get_src()
        return_json = {"srcs":srcs}
        #beauty_cursor = beauty_cursor+1
        #beauty_url = 'http://gank.io/api/data/%E7%A6%8F%E5%88%A9/10/'+str(beauty_cursor)
        print(beauty_url)
        return HttpResponse(json.dumps(return_json), content_type='application/json')
        
