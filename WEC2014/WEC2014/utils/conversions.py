def map2graph(maplist):
    import networkx as nx
    G = nx.Graph()
    hq = (0,0);
    for i in xrange(len(maplist)):
        for j in xrange(len(maplist[0])):

            if (maplist[i][j] == 'H'):
                hq = (j, i)

            if not(maplist[i][j] == 'X'):
                neighbours = filter(
                    lambda x: x[0]>=0 and x[1]>=0, 
                    [(i-1, j), (i+1, j), (i, j-1), (i, j+1)]
                )
                for (i_n, j_n) in neighbours:
                    try:
                        if not(maplist[i_n][j_n] == 'X'):
                            G.add_edge((j_n, i_n),(j,i));
                    except IndexError:
                        pass
    return G, hq


def data2json(nodes, action_ids, package_ids):
    import json
    action_names = {
        '0' : 'start',
        '1' : 'drive',
        '2' : 'pickup',
        '3' : 'dropoff',
    }

    output = [{
        'carrierId' : 'mofo1',
        'actions' : []
    }]

    for (node, action_id, package_id) in zip(nodes, action_ids, package_ids):
        action_name = action_names[str(action_id)]

        if action_id in (2,3):
            action_drive = {
                'action' : 'drive',
                'x' : node[1],
                'y' : node[0]
            }

            action = {
                'action' : action_name,
                'id': package_id
            }

            output[0]['actions'].append(action_drive)
            output[0]['actions'].append(action)
        else:
            action = {
                'action' : action_name,
                'x' : node[1],
                'y' : node[0],
            }
            output[0]['actions'].append(action)


    return output
