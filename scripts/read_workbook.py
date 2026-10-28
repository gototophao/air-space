"""Read the content workbook with Python standard library; no installation needed."""
import json, sys, zipfile, posixpath, subprocess
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def read_workbook(path):
    with zipfile.ZipFile(path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            shared = [''.join(t.itertext()) for t in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si', NS)]
        rels = {r.attrib['Id']: posixpath.normpath(posixpath.join('xl', r.attrib['Target'])) if not r.attrib['Target'].startswith('/') else r.attrib['Target'].lstrip('/') for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
        result = {}
        for sheet in ET.fromstring(z.read('xl/workbook.xml')).findall('s:sheets/s:sheet',NS):
            rel = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
            rows=[]
            for row in ET.fromstring(z.read(rels[rel])).findall('s:sheetData/s:row',NS):
                ri=int(row.attrib['r'])-1
                while len(rows)<=ri: rows.append([])
                for cell in row.findall('s:c',NS):
                    col=0
                    for ch in cell.attrib['r']:
                        if ch.isalpha(): col=col*26+ord(ch.upper())-64
                        else: break
                    while len(rows[ri])<col: rows[ri].append('')
                    if cell.find('s:f',NS) is not None: raise ValueError('内容表请直接填写文字，不要使用公式。')
                    value=cell.find('s:v',NS)
                    value=value.text if value is not None else ''
                    if cell.attrib.get('t')=='s': value=shared[int(value)]
                    elif cell.attrib.get('t')=='inlineStr': value=''.join(cell.find('s:is',NS).itertext())
                    rows[ri][col-1]=value or ''
            result[sheet.attrib['name']]=rows
        return result

if __name__=='__main__':
    sheets=read_workbook(sys.argv[1] if len(sys.argv)>1 else ROOT/'data/Air-Space-Content.xlsx')
    if '--json' in sys.argv: print(json.dumps(sheets,ensure_ascii=False))
    else:
        result=subprocess.run(['node',str(ROOT/'scripts/write_content.cjs')],input=json.dumps(sheets,ensure_ascii=False),text=True,check=True,capture_output=True)
        (ROOT/'content.js').write_text(result.stdout,encoding='utf-8')
        print('Updated content.js from workbook.')
