import sqlite3
import json

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

conn = sqlite3.connect('www/gtfs.sqlite')
conn.row_factory = dict_factory
cur = conn.cursor()

sql = """
    SELECT
    t.route_index,
    t.trip_headsign,
    st.stop_index,
    s.stop_lat as latitude,
    s.stop_lon as longitude,
    t.shape_index,
    st.last_stop
  FROM stop_times AS st
  JOIN stops AS s ON s.stop_index = st.stop_index
  JOIN trips AS t ON st.trip_index = t.trip_index
  WHERE st.last_stop = 0
  GROUP BY t.route_index, st.stop_index, t.trip_headsign
  ORDER BY t.route_index
  ;
  """

index = []
for row in cur.execute(sql):
    index.append(row)

outfile = open('www/gtfs.index.json', 'w')
outfile.write(json.dumps(index))
outfile.close()
