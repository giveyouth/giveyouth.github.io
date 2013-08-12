jQuery.fn.slidesort = function(grader){
	// go through each element, assign it a grade
	// find longest increasing sequence based on grades
	// to calculate elements which get a stay
	// then sort the rest and insert appropriately
	// a la mergesort
	var pool = $(this).not('.dephasing');
	
	var grades = [], elves = [];
	pool.each(function(){
		var grade = grader($(this));
		grades.push(grade) //TODO: switch to using .call for jquery idiomatic style
		elves.push(this)
		$(this).data('__slidesort2', grade)
	})
	// GRADES = grades
	var exclude = LIS(grades, elves); // find the elements which are already sorted

	var shifting = pool.not(exclude);
	

	var sorted = shifting.toArray().sort(function(a, b){
		return $(a).data('__slidesort2') - $(b).data('__slidesort2')
	});
	// console.log(shifting.length, 'shifts')
	
	// this is ironic because we could have used patience sorting to find the 
	// longest increasing subsequence
	function patientInsertion(el, anchor, after){
		if(el.queue('fx').length == 0){
			// OKAY TO GO
			var clone = el.clone().hide()
			if(after){
				clone.insertAfter(anchor)
			}else{
				clone.insertBefore(anchor)
			}
			
			clone.slideDown('slow')

			el
				.addClass('dephasing')
				.slideUp('slow', function(){
					$(this).remove()
					if(anchor.is_flag){
						$(anchor).remove()
					}
				})
		}else{
			if(!anchor.is_flag){
				var flag = document.createTextNode('')
				flag.is_flag = true;
				if(after){
					anchor.after(flag)
				}else{
					anchor.before(flag)
				}
				anchor = flag;
			}

			var q = $(this).queue('fx')
			if(q) q.splice(1, q.length);

			el.queue(function(next){
				// console.log('floop')
				next()
				patientInsertion(el, anchor, after)
			})
		}
	}
	$(exclude).each(function(){
		var anchor = $(this);
		while(sorted.length > 0 && $(sorted[0]).data('__slidesort2') < anchor.data('__slidesort2')){
			var first = $(sorted.shift());
			patientInsertion(first, anchor)
		}
		if(sorted.length == 0){
			return false;
		}
	});
	var anchor = $(exclude).last();

	$(sorted).each(function(){
		anchor = $(document.createTextNode('')).insertAfter(anchor)
		patientInsertion($(this), anchor, true)
	})

	return $(this)


	// The StackOverflow Thief Strikes Again, Leaving Seas of Carage in His Wake
	// Copying stuff from stackoverflow would be an odd modus operandi to find
	// in some kind of police report. http://stackoverflow.com/a/7918909

	function LIS(X, m){
		m = m || X;
		var n = X.length,
			M = new Array(n + 1),
			P = new Array(n + 1),
			L = 0;
		for(var i = 1; i < n + 1; i++){
			if(L == 0 || X[M[1] - 1] > X[i - 1]){
				j = 0;
			}else{
				var lo = 1, hi = L + 1;
				while(lo < hi - 1){
					mid = Math.floor((lo + hi) / 2)
					if(X[M[mid] - 1] <= X[i - 1]){
						lo = mid
					}else{
						hi = mid
					}
				}
				j = lo;
			}
			P[i] = M[j];
			if(j == L || X[i - 1] <= X[M[j + 1] - 1]){
				M[j + 1] = i;
				L = Math.max(L, j + 1)
			}
		}
		var output = [],
			pos = M[L];
		while(L > 0){
			output.push(m[pos - 1]);
			pos = P[pos];
			L--;
		}
		output.reverse()
		return output
	}
}
