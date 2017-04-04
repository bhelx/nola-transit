require 'RMagick'
require 'sqlite3'

db = SQLite3::Database.new('./www/gtfs.sqlite')
rows = db.execute("SELECT route_color FROM routes")
colors = rows.map(&:first).uniq

# Create 2 markers per color
colors.each do |color|
  canvas = Magick::Image.new(40, 40) do |c|
    c.background_color = 'Transparent'
  end

  circle = Magick::Draw.new
  circle.stroke("##{color}")
  circle.fill_opacity(0)
  circle.fill('#FFF')
  circle.stroke_width(5)
  circle.ellipse(canvas.rows/2, canvas.columns/2, 15, 15, 0, 360)
  circle.draw(canvas)

  puts "Writing marker with color: #{color}"
  canvas.write("./assets/markers/#{color}.gif")

  canvas = Magick::Image.new(40, 40) do |c|
    c.background_color = 'Transparent'
  end

  circle = Magick::Draw.new
  circle.stroke("##{color}")
  circle.stroke_opacity(0.5)
  circle.fill_opacity(0.5)
  circle.fill('#FFF')
  circle.stroke_width(5)
  circle.ellipse(canvas.rows/2, canvas.columns/2, 15, 15, 0, 360)
  circle.draw(canvas)

  puts "Writing translucent marker with color: #{color}"
  canvas.write("./assets/markers/#{color}_translucent.gif")
end

# Write the import file
js_file = File.open('./assets/markers.js', 'w')

colors.each do |color|
  js_file.write <<-JS
import marker_#{color} from "./markers/#{color}.gif"
import marker_#{color}_translucent from "./markers/#{color}_translucent.gif"
  JS
end

js_file.write <<-JS
export default {
JS

colors.each do |color|
  js_file.write <<-JS
    "marker_##{color}": marker_#{color},
    "marker_##{color}_translucent": marker_#{color}_translucent,
  JS
end

js_file.write <<-JS
};
JS

js_file.close()

