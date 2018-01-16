from django.shortcuts import render
from django.shortcuts import HttpResponse
# Create your views here.

import json
from weather_app import weather_info, infos_io

import os

currentpath = os.getcwd()
path = currentpath+"/area_code.json"

def weather(request):
    fp = open(path,'r',encoding="gb18030")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                             'Chrome/63.0.3239.108 Safari/537.36'}
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
