from django.http import HttpResponse
import json
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
import os
import networkx as nx
from WEC2014.utils.conversions import *

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def home(request):
  return render_to_response('index.html', {"foo": "bar"},
    context_instance=RequestContext(request))

@csrf_exempt
def solve(request):

  maplist = json.loads(request.body).get('map').split('\n')
  request_data = json.loads(request.body).get('delivery_requests')

  (G, hq) = map2graph(maplist)
  # print G.nodes()
  pd_pairs, revenue, ids = convert_request_to_pd(request_data)
  (nodes, actions, cost, wait_time, id_data) = solve_case(G, hq, pd_pairs, ids)
  
  output = data2json(nodes, actions, id_data) 
  data = {
    "cost": cost,
    "revenue": revenue,
    "output": output,
    "wait_time": sum(wait_time)
  }
  return HttpResponse(
    content = json.dumps(data),
    content_type = "application/json"
  )


def solve_map (request):
  # graph_map = request.GET.get('map')
  # graph_map = graph_map.split('\n')
  # request_data = request.GET.get('request_data')
  with open('../input/Maps/map100_1.txt', 'r') as f:
    graph_map = f.read().split('\n')

  request_data = json.load(open('../input/Requests/requests100_1.txt'))
  
  (G, hq) = map2graph(graph_map)
  print G.nodes()
  pd_pairs, revenue, ids = convert_request_to_pd(request_data)
  (nodes, actions, cost, wait_time, id_data) = solve_case(G, hq, pd_pairs, ids)
  
  output = data2json(nodes, actions, id_data) 
  data = {
    "cost": cost,
    "revenue": revenue,
    "output": output,
    "wait_time": sum(wait_time)
  }
  return HttpResponse(
    content = json.dumps(data),
    content_type = "application/json"
  )

def solve_case(G, start, pd, ids):
  unvisited = pd
  prev = start
  visited_nodes = []
  visited_nodes.append(prev)
  actions = []

  cost = 50
  actions.append(0)
  try:
    pd_paths = {pd_tuple: nx.shortest_path(G, pd_tuple[0], pd_tuple[1])
      for pd_tuple in unvisited}
  except: 
    pass
  min_path = []
  wait_times = []
  id_data = [0];
  number_of_actions = 0
  
  while len(unvisited) > 0:
    for n in unvisited:
      current_path_to_next = nx.shortest_path(G, prev, n[0])
      pd_path = pd_paths[n]

      if len(min_path) == 0 or len(current_path_to_next) + len(pd_path) < len(min_path):
        min_path = current_path_to_next
        next_pair = n;

    actions += [1]*(len(min_path)-2)
    id_data += [1]*(len(min_path)-2)
    number_of_actions += len(min_path)-2
    visited_nodes += min_path[1:]

    actions.append(2)
    id_data.append(ids[next_pair]);
    number_of_actions += 2

    visited_nodes += pd_paths[next_pair][1:]
    actions += [1]*(len(pd_paths[next_pair])-2)
    id_data += [1]*(len(pd_paths[next_pair])-2)
    number_of_actions += (len(pd_paths[next_pair])-2)

    actions.append(3)
    id_data.append(ids[next_pair])
    number_of_actions += 2

    wait_times.append(number_of_actions);

    unvisited.remove(next_pair)
    prev = next_pair[1]
    min_path = []

  cost += len(visited_nodes)-1

  return visited_nodes, actions, cost, wait_times, id_data

def convert_request_to_pd (req):
  l = []
  revenue = 0
  ids = {}
  for k in req['requests']:
    pick = k['pickup']
    drop = k['dropoff']
    pd_tuple = ((pick['x'], pick['y']), (drop['x'], drop['y']))
    l.append(pd_tuple)
    ids[pd_tuple] = k['id']
    revenue += k['deliveryFee']
  return l, revenue, ids
 
