import json

from pyexcel_ods3 import get_data


ods_data = get_data('laws.ods')

buckets = {}

for sheet, rows in ods_data.items():
    bucket = []
    headers = [x.strip().lower() for x in rows[0]]
    for row in rows[1:]:
        if not row or not row[0].strip():
            continue

        bucket.append({k: v for k, v in zip(headers, row)})

    buckets[sheet] = list(bucket)


with open('../laws.json', 'w') as f:
    f.write(json.dumps(buckets))
