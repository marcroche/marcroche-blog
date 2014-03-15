/*function Dijkstra(Graph, source):
      dist[source] := 0                     // Initializations
      for each vertex v in Graph:           
          if v ≠ source
              dist[v] := infinity           // Unknown distance from source to v
              previous[v] := undefined      // Predecessor of v7          end if
          PQ.add_with_priority(v,dist[v])
      end for 


     while PQ is not empty:                // The main loop
         u := PQ.extract_min()             // Remove and return best vertex
         for each neighbor v of u:         // where v has not yet been removed from PQ.
             alt = dist[u] + length(u, v) 
             if alt < dist[v]              // Relax the edge (u,v) 
                 dist[v] := alt 
                 previous[v] := u
                 PQ.decrease_priority(v,alt)
             end if
         end for
     end while
     return previous[]
     */

//TODO: Update this with hasPathTo
mr_com.Dijkstra = (function (MinPriorityQueue, Q) {

    var priorityQueue;
    var distTo = [];
    var shortestEdges = [];
    var startVertex, endVertex;

    function relax(edge) {
        var source = edge.source;
        var target = edge.target;

        if (target.isBlocked) {
            return;
        }

        if (target.cost > source.cost + edge.weight) {
            target.cost = source.cost + edge.weight;

            var se = _.findWhere(shortestEdges, { key: target.key });
            if (se !== undefined) {
                se.edge = edge;
            } else {
                shortestEdges.push({ key: target.key, edge: edge });
            }

            if (priorityQueue.contains(target.key)) {
                priorityQueue.decreaseKey(target.heapIndex, target.cost);
            } else {
                priorityQueue.push(target);
            }
        }
    };

    function shortestPath(destinationKey) {
        var path = [];
        var e = _.findWhere(shortestEdges, { key: destinationKey });

        if (e === undefined) {
            return path;
        }

        while (e !== undefined) {
            e = _.findWhere(shortestEdges, { key: e.edge.source.key });
            path.unshift(e);
        }
        return path;
    };

    function search() {
        var deferred = Q.defer();
        priorityQueue.push(startVertex);
        shortestEdges = [];

        var runner = setInterval(function () {
            var v = priorityQueue.pop();
            v.heapIndex = -1;
            for (var i = 0; i < v.edges.length; i++) {
                relax(v.edges[i]);
            }
            v.visited = true;
            deferred.notify({
                status: 'visited'
            });

            if (priorityQueue.isEmpty()) {
                clearInterval(runner);
                var sp = shortestPath(endVertex.key);

                if (sp.length === 0) {
                    deferred.resolve();
                }
                for (var s = 0; s < sp.length; s++) {
                    if (sp[s] !== undefined) {
                        sp[s].edge.target.isOnPath = true;
                    }
                }
                deferred.notify({
                    status: 'complete'
                });
                deferred.resolve();
            }
        }, 25);

        return deferred.promise;
    };

    var api = function (_startVertex, _endVertex) {
        startVertex = _startVertex;
        endVertex = _endVertex;
        priorityQueue = new MinPriorityQueue('key', 'cost', []);
        //priorityQueue.push(startVertex);

        this.search = search;
    };

    return api;

})(mr_com.MinPriorityQueue, Q);