require 'RMagick'
require 'sqlite3'

db = SQLite3::Database.new('./www/gtfs.sqlite')
rows = db.execute("SELECT route_color FROM routes")
colors = rows.map(&:first).uniq

# Create 2 markers per color
colors.each do |color|
  puts "Writing markers with color: #{color}"

  # Make small stop marker
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
  canvas.write("./assets/markers/#{color}.gif")

  # Make small transulcent stop marker
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
  canvas.write("./assets/markers/#{color}_translucent.gif")

  canvas = Magick::Image.new(60, 60) do |c|
    c.background_color = 'Transparent'
  end
  circle = Magick::Draw.new
  circle.stroke("#FFF")
  circle.fill_opacity(1)
  circle.fill("##{color}")
  circle.stroke_width(7)
  circle.ellipse(canvas.rows/2, canvas.columns/2, 23, 23, 0, 360)
  circle.draw(canvas)
  canvas.write("./assets/markers/#{color}_big.gif")
end

# Write the import file
js_file = File.open('./assets/markers.js', 'w')

colors.each do |color|
  js_file.write <<-JS
import marker_#{color} from "./markers/#{color}.gif"
import marker_#{color}_translucent from "./markers/#{color}_translucent.gif"
import marker_#{color}_big from "./markers/#{color}_big.gif"
  JS
end

js_file.write <<-JS
export default {
JS

colors.each do |color|
  js_file.write <<-JS
    "marker_##{color}": marker_#{color},
    "marker_##{color}_translucent": marker_#{color}_translucent,
    "marker_##{color}_big": marker_#{color}_big,
  JS
end

js_file.write <<-JS
};
JS

js_file.close()

