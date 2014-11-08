import networkx as nx

def map2graph(maplist):
    G = nx.Graph()
    hq = (0,0);
    for i in xrange(len(maplist)):
        for j in xrange(len(maplist[0])):

            if (maplist[i][j] == 'H'):
                hq = (i,j)

            if not(maplist[i][j] == 'X'):
                neighbours = filter(
                    lambda x: x[0]>=0 and x[1]>=0, 
                    [(i-1, j), (i+1, j), (i, j-1), (i, j+1)]
                )
                for (i_n, j_n) in neighbours:
                    try:
                        if not(maplist[i_n][j_n] == 'X'):
                            G.add_edge((i_n, j_n),(i,j));
                    except IndexError:
                        pass
    return G, hq