jQuery.fn.slidesort = function(ranker){
	// first we do the schwartzian transform and map ranker through
	// all the elements in the list O(n)

	// then we calculate the longest increasing subsequence 
	// with a suboptimal O(n^2) algorithm TODO: replace this
	// with an O(n log n) algorithm, but in practical terms
	// implementing a binary search for that little improvement
	// isn't worth it because it's a hassle to implement and 
	// for an animation thing, definitely not the bottleneck

	// we sort the list (see the schwartzian transform) - there's
	// probably a faster algorithm that could be made given that 
	// we already know the longest increasing subsequence (exclude
	// the others, do a sort of that, reinsert, a la merge sort) but
	// that's all theoretical and has nothing to do with slidey
	// animation thing in practical terms

	// we slide up all the elements which aren't part of the 
	// longest increasing subsequence, move them around and 
	// insert them where appropriate
	var element_mapping = {};
	var flag_mapping = {};
	$($(this).each(function(i){
		// apply schwartzian transform mapping each thing to the rank
		// based on whatever the ranker function is
		$(this).data('__slidesort', ranker($(this)))

		var flag = document.createTextNode('');
		this.parentNode.insertBefore(flag, this);
		// $(this).data('__slideflag', flag);
		flag_mapping[i] = flag;
	}).toArray().sort(function(a, b){
		// do the main sorting bidnezzz
		return $(a).data('__slidesort') - $(b).data('__slidesort')
	})).each(function(i){
		// now that we have each index, shove the index back in place
		$(this).data('__slidesort', i);
		element_mapping[i] = this;
	});
	var ordered_ranks = [];
	$(this).each(function(){
		ordered_ranks.push($(this).data('__slidesort'))
	})

	var exempt = $(longestIncreasingSequence(ordered_ranks)).map(function(){
		return element_mapping[this]
	});

	$(this).not(exempt).each(function(){
		var clone = $(this).clone().hide()
		$(this).slideUp('slow', function(){
			$(this).remove()
		})
		var flag = flag_mapping[$(this).data('__slidesort')];
		clone.insertBefore(flag)
		flag.parentNode.removeChild(flag);
		clone.slideDown('slow')
	})



	// shamelessly stolen from a stackoverflow answer
	// which i guess is my modus operandi
	// http://stackoverflow.com/questions/12948612/how-to-find-longest-increasing-sequence-starting-at-each-position-within-the-arr
	// nevermind, im stealing it from this gist now
	// https://gist.github.com/wheresrhys/4497653

	// 
	// longestIncreasingSequence
	// ---
	//
	// Javascript function for finding the longest increasing subsequence within a sequence of numbers
	//
	// @param {Array} arr  The array containng the sequence
	// @param {Boolean} strict  Boolean specifying whether to use strict (`<`) inequality (default is to use `<=`)
	// @return {Array}
	//
	function longestIncreasingSequence(arr, strict) {
	 
	    var index = 0,
	      indexWalker,
	    	longestIncreasingSequence,
	    	i,
	    	il,
	    	j;
	 
	    // start by putting a reference to the first entry of the array in the sequence
	    indexWalker = [index];
	    	
	    // Then walk through the array using the following methodolgy to find the index of the final term in the longestIncreasing and
	    // a sequence (which may need altering later) which probably, roughly increases towards it - http://en.wikipedia.org/wiki/Longest_increasing_subsequence#Efficient_algorithms
		for (i = 1, il = arr.length; i < il; i++) {
			
	        if (arr[i] < arr[indexWalker[index]]) {
	         	
	         	// if the value is smaller than the last value referenced in the walker put it in place of the first item larger than it in the walker
	        	for (j = 0; j <= index; j++) {
	 
	            	// As well as being smaller than the stored value we must either 
	            	// - be checking against the first entry
	            	// - not be in strict mode, so equality is ok
	            	// - be larger than the previous entry
	                if (arr[i] < arr[indexWalker[j]] && (!strict || !j || arr[i] > arr[indexWalker[j-1]])) {
	                    indexWalker[j] = i;
	                    break;
	                }
	            }
	 
	        // If the value is greater than [or equal when not in strict mode) as the last in the walker append to the walker
	        } else if (arr[i] > arr[indexWalker[index]] || (arr[i] === arr[indexWalker[index]] && !strict))  {
	            indexWalker[++index] = i;
	        }
			
	    }
	 
	    // Create an empty array to store the sequence and write the final term in the sequence to it
		longestIncreasingSequence = new Array(index + 1);
		longestIncreasingSequence[index] = arr[indexWalker[index]];
	 
	 
		// Work backwards through the provisional indexes stored in indexWalker checking for consistency
		for (i = index - 1; i >= 0; i--) {
	 
			// If the index stored is smaller than the last one it's valid to use its corresponding value in the sequence... so we do  
			if (indexWalker[i] < indexWalker[i + 1]) {
	            longestIncreasingSequence[i] = arr[indexWalker[i]];
	 
	        // Otherwise we need to work backwards from the last entry in the sequence and find a value smaller than the last entry 
	        // but bigger than the value at i (this must be possible because of the way we constructed the indexWalker array)
	        } else {
	            for ( j = indexWalker[i + 1] - 1; j >= 0; j--) {
	                if ((strict && arr[j] > arr[indexWalker[i]] && arr[j] < arr[indexWalker[i + 1]]) || 
	                	(!strict && arr[j] >= arr[indexWalker[i]] && arr[j] <= arr[indexWalker[i + 1]]) ){
	                    longestIncreasingSequence[i] = arr[j];
	                    indexWalker[i] = j;
	                    break;
	                }
	            }
	        }
	    }
	 
	    return longestIncreasingSequence;
	}
}