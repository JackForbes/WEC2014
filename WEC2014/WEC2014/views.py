from django.http import HttpResponse
import json
from django.shortcuts import render_to_response
from django.template import RequestContext
import os
import networkx as nx
from WEC2014.utils.conversions import *

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def home(request):
  return render_to_response('index.html', {"foo": "bar"},
    context_instance=RequestContext(request))

def solve_map (request):
  # graph_map = request.GET.get('map')
  # graph_map = graph_map.split('\n')
  # request_data = request.GET.get('request_data')
  graph_map = [
      '   ',
      'X X',
      'H X'
  ]
  request_data = {
      "requests": [
        {
          "dropoff": {
            "y": 1,
            "x": 2
          },
          "pickup": {
            "y": 0,
            "x": 0
          },
          "deliveryFee": 10,
        },
        {
          "dropoff": {
            "y": 2,
            "x": 0
          },
          "pickup": {
            "y": 1,
            "x": 1
          },
        "deliveryFee": 10,

        }
      ]
    }

  
  (G, hq) = map2graph(graph_map)
  pd_pairs, revenue = convert_request_to_pd(request_data)
  (nodes, actions, cost, wait_time) = solve_case(G, hq, pd_pairs)
  
  output = data2json(nodes, actions, [0]*len(actions)) 
  data = {
    "cost": cost,
    "revenue": revenue,
    "output": output,
    "wait_time": wait_time
  }
  return HttpResponse(
    content = json.dumps(data),
    content_type = "application/json"
  )

def solve_case(G, start, pd):
  unvisited = pd
  prev = start
  visited_nodes = []
  visited_nodes.append(prev)
  actions = []
  cost = 50
  actions.append(0)
  pd_paths = {pd_tuple: nx.shortest_path(G, pd_tuple[0], pd_tuple[1])
    for pd_tuple in unvisited}
  min_path = []
  wait_times = []
  number_of_actions = 0
  while len(unvisited) > 0:
    for n in unvisited:
      current_path_to_next = nx.shortest_path(G, prev, n[0])
      pd_path = pd_paths[n]
      if len(min_path) == 0 or len(current_path_to_next) + len(pd_path) < len(min_path):
        min_path = current_path_to_next
        next_pair = n;
    actions += [1]*(len(min_path)-2)
    number_of_actions += len(min_path)-2
    visited_nodes += min_path[1:]
    actions.append(2)
    number_of_actions += 2
    
    visited_nodes += pd_paths[next_pair][1:]
    actions += [1]*(len(pd_paths[next_pair])-2)
    number_of_actions += (len(pd_paths[next_pair])-2)
    actions.append(3)
    number_of_actions += 2
    
    wait_times.append(number_of_actions);
      
    unvisited.remove(next_pair)
    prev = next_pair[1] 
    min_path = []


  cost += len(visited_nodes)-1
  # return visited_nodes, actions, cost, sum(wait_times)
  return visited_nodes, actions, cost, wait_times

def convert_request_to_pd (req):
  l = []
  revenue = 0
  for k in req['requests']:
    pick = k['pickup']
    drop = k['dropoff']

    l.append(((pick['x'], pick['y']), (drop['x'], drop['y'])))
    revenue += k['deliveryFee']
  return l, revenue
 
