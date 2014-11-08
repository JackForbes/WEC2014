from django.shortcuts import render_to_response
from django.template import RequestContext
import os
import networkx as nx

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def home(request):
  return render_to_response('index.html', {"foo": "bar"},
    context_instance=RequestContext(request))

def solve_case(G, start, pd):
  unvisited = pd
  prev = start
  visited_nodes = []
  visited_nodes.append(prev)
  actions = []

  actions.append(0)
  pd_paths = {pd_tuple: nx.shortest_path(G, pd_tuple[0], pd_tuple[1])
    for pd_tuple in unvisited}

  min_path = []
  while len(unvisited) > 0:
    for n in unvisited:
      current_path_to_next = nx.shortest_path(G, prev, n[0])
      pd_path = pd_paths[n]

      if len(min_path) == 0 or len(current_path_to_next) + len(pd_path) < len(min_path):
        min_path = current_path_to_next
        next_pair = n;


    actions += [1]*(len(min_path)-2)
    visited_nodes += min_path[1:]
    actions.append(2)

    visited_nodes += pd_paths[next_pair][1:]
    actions += [1]*(len(pd_paths[next_pair])-2)
    actions.append(3)

    unvisited.remove(next_pair)
    prev = next_pair[1]
    min_path = []

  return visited_nodes, actions

 
