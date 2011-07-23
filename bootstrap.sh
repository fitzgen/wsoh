virtualenv --no-site-packages -p `which python2.7` environment
cd environment
source bin/activate

ln -s ../requirements.txt requirements.txt
pip install -r requirements.txt

pycoweb deploy .

ln -s ../www www
ln -s ../bots bots

cp ../bin/run_server.py bin/run_server.py

echo "# To start, run:"
echo cd environment/
echo source bin/activate
echo run_server.py
echo "# And open browser to http://localhost:8080/pragmatico/www/index.html"
