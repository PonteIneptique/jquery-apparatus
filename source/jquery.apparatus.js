(function ( $ ) {
  $.fn.apparatus = function(params) {
    var elements = this;


    /* Find differents type of target
      Example : You have a witness checkboxes groups and an apparatus, they are treated separatly and complementary
    */
    var findFacets = function(elements) {
      var filters = [],
        i = 0;
      while(i <= (elements.length-1)) {
        var elem = $(elements[i]);
        if(typeof elem.data("category") === "string" && $.inArray(elem.data("category"), filters) === -1) {
          filters.push(elem.data("category"))
        }
        i++;
      };
      return filters;
    }

      //Combinate arrays
      var combinate = function ($array, $all) {
        if(typeof $all === "undefined") {
          $all = false;
        }
        var $current = $array,
            $output = [];
        if($array.length > 2) {
          var $current = [$array[0], $array[1]];
        } else if ($array.length == 1) {
          return $array;
        }
        if($all === true) {
          for(var i = 0; i < $current[0].length; i++) {
            $output.push($current[0][i]);
          }
        }
        if($current[1].length > 0 && $current[0].length > 0) {
          for(var i = 0; i < $current[1].length; i++) {
            if($all === true) {
              $output.push($current[1][i]);
            }
            for(var j = 0; j < $current[0].length; j++) {
              $output.push($current[0][j] + $current[1][i]);
            }
          }
        } else if ($current[1].length > 0) {
        for(var i = 0; i < $current[1].length; i++) {
             $output.push($current[1][i]);
          }
        } else if ($current[0].length > 0) {
        for(var i = 0; i < $current[0].length; i++) {
             $output.push($current[0][i]);
          }

        }
        
        if($array.length > 2) {
          $array = $array.slice(2, $array.length)
          $array.push($output);
          return combinate($array, $all);
        } else {
          return $output;
        }
      }

    //Apply default params to our params
    var applyParams = function(params, elements) {
      //Default params
      var def = {
        active : "active",
        facets : [],
        target : "choice-apparatus"
      };
      //Parameters check
      if (typeof params === "object") {
        //Active class represent the class that sould be added or removed to display activate a new css class like .class.active
        if(typeof params.active === "string" && params.active.length > 0) {
          def.active = params.active;
        }
        //Target represents the element which will have the activa class toggled.
        if(typeof params.target === "string" && params.target.length > 0) {
          def.target = params.target;
        }

        if(typeof params.facets !== "undefined" && Object.prototype.toString.call(param.facets) === "[object Array]" && param.facets.length > 0) {
          def.facets = param.facets;
        } else {
          def.facets = findFacets(elements);
        }

      } else if (typeof params === "string") {
            def.target = params;
            def.facets = findFacets(elements);
       }

       if(def.facets.length < 2) {
          def.facets = [elements.selector]
       }

      return def;
    }


      var valueToArray = function(obj) {
        return Object.keys(obj).map(function (key) { return obj[key]; });
      }

    /* Application of functions */
    var params = applyParams(params, elements);

      var getSelector = function(params) {
         var $facets = {};
         if(typeof params.facets === "object" && params.facets.length != 0) {
            var i = 0;
            while(i < params.facets.length) {
               if(typeof $facets[params.facets[i]] === "undefined") {
                  $facets[params.facets[i]] = [];
               }
               $(params.facets[i] + ":checked").each( function () {
                  $facets[params.facets[i]].push($(this).attr("data-target"));
               });
               i++;
            }
            var i = 0,
               $realFacets = combinate(valueToArray($facets)),
               $facets = $realFacets.join(", ");

         } else {
            var $facets = []
            // Only one category of checked box
            $(params.facets + ":checked").each( function () {
               $facets.push($(this).attr("data-target"));
            });
            var $facets = $facets.join(", ");
         }
         return $facets;
      }

      /*
        Pour chacun des activations witness ou apparat qui sont cochés, on remplit les tableaux correspondants
      */
            

      /*
         Application on each element
      */

      var i = 0;
      while(i < elements.length)  {
         $(elements[i]).on("change", function(e) {
            /* 
               En cas d'absence de sélécteur,
               on élimine la classe.
               addClass pour voir tout 
            */

            params.selector = getSelector(params);
            if(params.selector == params.target) {
               $(params.target).removeClass(params.active);
            } else {
               $(params.selector).addClass("active");
               $(params.target + ":not(" + params.selector + ")").removeClass(params.active);
            }

         });
         i++;
      }

    return this;
  };
}( jQuery ));