from pathlib import Path
import json

from django.shortcuts import render
from django.http import HttpResponse

from bs4 import BeautifulSoup
import requests

AXIOS = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
VUE = 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js'

# Create your views here.
def index(request):
    params = {
        'axios': AXIOS,
        'vue': VUE,
        'css_list': ['anyping/css/index.css'],
        'js': 'anyping/js/index.js'
    }
    return render(request, 'anyping/index.html', params)

def pyping(request):
    params = {
        'axios': AXIOS,
        'vue': VUE,
        'css_list': ['anyping/css/index.css', 'anyping/css/pyping.css'],
        'js': 'anyping/js/pyping.js',
        'logo': 'anyping/images/python-logo-master-v3-TM-flattened.png'
    }
    return render(request, 'anyping/pyping.html', params)

def pyping_api(request):
    base_dir = Path('anyping/static/anyping/questions/')
    question_files = [file for file in base_dir.glob('*.csv')]
    if not question_files:
        target_url = 'https://docs.python.org/3/py-modindex.html'
        html = requests.get(target_url)
        sp = BeautifulSoup(html.text, 'html.parser')

        pycode = []
        for c in sp.find_all('code'):
            if c:
                c = c.text.strip().replace('\n', ' ')
                pycode.append(c)
    
        with open(base_dir.joinpath('pycode.csv'), 'w') as f:
            f.write("\n".join(pycode))
    
        pydesc = []
        for s in sp.find_all('em'):
            if s:
                s = s.text.strip().replace('\n', ' ')
                if s not in ['(Unix)', '(Linux)', '(Windows)', '(Linux, FreeBSD)', '(Tk)']:
                    pydesc.append(s)
    
        with open(base_dir.joinpath('pydesc.csv'), 'w') as f:
            f.write("\n".join(pydesc))
    else:
        with open(base_dir.joinpath('pycode.csv'), 'r') as f:
            pycode = f.readlines()

        with open(base_dir.joinpath('pydesc.csv'), 'r') as f:
            pydesc = f.readlines()

    df = []
    for code, desc in zip(pycode, pydesc):
        df.append({'code': code.strip(), 'desc': desc.strip()})
    print(json.dumps(df))
    return HttpResponse(json.dumps(df))
