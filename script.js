        class SortingVisualizer {
            constructor() {
                this.array = [];
                this.isRunning = false;
                this.isPaused = false;
                this.pauseResolver = null;
                this.stepMode = false;
                this.stepHistory = [];
                this.stepIndex = 0;
                this.stats = { comparisons: 0, swaps: 0, arrayAccess: 0, startTime: 0 };
                this.speed = 100; // Default speed, will be updated by slider
                this.algorithms = {
                    bubble: {
                        name: 'Bubble Sort',
                        description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                        avgComplexity: 'O(n²)',
                        bestComplexity: 'O(n)',
                        worstComplexity: 'O(n²)'
                    },
                    selection: {
                        name: 'Selection Sort',
                        description: 'Selection Sort finds the smallest element in the unsorted part of the array and puts it at the beginning.',
                        avgComplexity: 'O(n²)',
                        bestComplexity: 'O(n²)',
                        worstComplexity: 'O(n²)'
                    },
                    insertion: {
                        name: 'Insertion Sort',
                        description: 'Insertion Sort builds the final sorted array one item at a time by inserting each element into its correct position.',
                        avgComplexity: 'O(n²)',
                        bestComplexity: 'O(n)',
                        worstComplexity: 'O(n²)'
                    },
                    merge: {
                        name: 'Merge Sort',
                        description: 'Merge Sort divides the array into smaller parts, sorts them, and then merges them back together.',
                        avgComplexity: 'O(n log n)',
                        bestComplexity: 'O(n log n)',
                        worstComplexity: 'O(n log n)'
                    },
                    quick: {
                        name: 'Quick Sort',
                        description: 'Quick Sort picks an element as a pivot and partitions the array around the pivot, then recursively sorts the sub-arrays.',
                        avgComplexity: 'O(n log n)',
                        bestComplexity: 'O(n log n)',
                        worstComplexity: 'O(n²)'
                    },
                    heap: {
                        name: 'Heap Sort',
                        description: 'Heap Sort uses a binary heap data structure to find the largest element and place it at the end of the array.',
                        avgComplexity: 'O(n log n)',
                        bestComplexity: 'O(n log n)',
                        worstComplexity: 'O(n log n)'
                    }
                };

                this.pseudocodes = {
                    bubble: [
                        'for i from 0 to n-1',
                        '  for j from 0 to n-i-1',
                        '    if A[j] > A[j+1]',
                        '      swap A[j], A[j+1]',
                        '  mark n-i-1 as sorted'
                    ],
                    selection: [
                        'for i from 0 to n-1',
                        '  minIndex = i',
                        '  for j from i+1 to n-1',
                        '    if A[j] < A[minIndex]',
                        '      minIndex = j',
                        '  swap A[i], A[minIndex]'
                    ],
                    insertion: [
                        'for i from 1 to n-1',
                        '  key = A[i]',
                        '  j = i - 1',
                        '  while j >= 0 and A[j] > key',
                        '    A[j+1] = A[j]; j--',
                        '  A[j+1] = key'
                    ],
                    merge: [
                        'if left >= right return',
                        'mid = (left + right) / 2',
                        'mergeSort(left, mid)',
                        'mergeSort(mid+1, right)',
                        'merge(left, mid, right)'
                    ],
                    quick: [
                        'if low < high',
                        '  pi = partition(low, high)',
                        '  quickSort(low, pi-1)',
                        '  quickSort(pi+1, high)'
                    ],
                    heap: [
                        'buildMaxHeap()',
                        'for i from n-1 downto 1',
                        '  swap A[0], A[i]',
                        '  heapify(0, i)'
                    ]
                };
                this.initializeEventListeners();
                this.generateArray(); // Generate initial array
                this.updateAlgorithmInfo(); // Set initial algorithm info
                this.initializeAnimations();
                this.createComplexityChart();
                this.displayPseudocode();
            }

            initializeEventListeners() {
                document.getElementById('arraySize').addEventListener('input', (e) => {
                    document.getElementById('arraySizeValue').textContent = e.target.value;
                    if (!this.isRunning) this.generateArray();
                });

                document.getElementById('speed').addEventListener('input', (e) => {
                    document.getElementById('speedValue').textContent = e.target.value;
                    // Speed value from 1 (slowest) to 10 (fastest)
                    // Map to delay: 1 -> 200ms, 10 -> 1ms (approx)
                    // We use 201 - (value * 20) to get a range like 181ms (for 1) down to 1ms (for 10)
                    this.speed = 201 - (parseInt(e.target.value) * 20);
                });

                document.getElementById('algorithmSelect').addEventListener('change', () => {
                    this.updateAlgorithmInfo();
                });

                document.getElementById('startBtn').addEventListener('click', () => {
                    this.startSorting();
                });

                document.getElementById('resetBtn').addEventListener('click', () => {
                    this.resetArray();
                });

                document.getElementById('pauseBtn').addEventListener('click', () => {
                    if (this.isPaused) {
                        this.resume();
                        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';
                    } else {
                        this.pause();
                        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play mr-2"></i>Resume';
                    }
                });

                document.getElementById('nextStepBtn').addEventListener('click', () => {
                    this.nextStep();
                });

                document.getElementById('prevStepBtn').addEventListener('click', () => {
                    this.previousStep();
                });
            }

            generateArray() {
                const size = parseInt(document.getElementById('arraySize').value);
                this.array = Array.from({length: size}, () => Math.floor(Math.random() * 350) + 10); // Values from 10 to 360
                this.renderArray();
                this.resetStats();
            }

            renderArray() {
                const container = document.getElementById('arrayContainer');
                container.innerHTML = ''; // Clear previous bars

                const containerWidth = container.clientWidth;
                // Calculate bar width, ensuring at least 1px margin between bars
                const barWidth = Math.max(2, Math.floor((containerWidth - (this.array.length -1)) / this.array.length));


                this.array.forEach((value, index) => {
                    const bar = document.createElement('div');
                    bar.className = 'bar';
                    bar.style.width = `${barWidth}px`;
                    bar.style.height = `${value}px`; // Height corresponds to value
                    bar.style.background = 'linear-gradient(45deg, #667eea, #764ba2)'; // Default color
                    bar.style.margin = '0 1px'; // Margin between bars
                    bar.setAttribute('data-tippy-content', `Value: ${value}, Index: ${index}`);
                    container.appendChild(bar);
                });

                // Initialize tooltips for new bars
                if (typeof tippy !== 'undefined') {
                    tippy('[data-tippy-content]', {
                        theme: 'dark',
                        animation: 'scale'
                    });
                } else {
                    console.warn('Tippy.js not loaded, tooltips will not be available.');
                }
            }

            async highlightBars(indices, className, duration = 300) {
                const bars = document.querySelectorAll('.bar');
                indices.forEach(i => {
                    if (bars[i]) bars[i].classList.add(className);
                });

                await this.sleep(duration); // Use the dynamic speed

                indices.forEach(i => {
                    if (bars[i]) bars[i].classList.remove(className);
                });
                this.recordStep();
                await this.checkPaused();
            }

            async swapBars(i, j) {
                const bars = document.querySelectorAll('.bar');
                if (!bars[i] || !bars[j]) return;

                await this.highlightBars([i, j], 'bar-swapping', this.speed);

                // Swap in array
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];

                // Swap heights visually
                const tempHeight = bars[i].style.height;
                bars[i].style.height = bars[j].style.height;
                bars[j].style.height = tempHeight;

                // Update tooltips
                if (bars[i]._tippy) {
                    bars[i].setAttribute('data-tippy-content', `Value: ${this.array[i]}, Index: ${i}`);
                }
                if (bars[j]._tippy) {
                     bars[j].setAttribute('data-tippy-content', `Value: ${this.array[j]}, Index: ${j}`);
                }


                this.updateStats('swaps');
                this.recordStep();
                await this.checkPaused();
            }

            async bubbleSort() {
                const n = this.array.length;
                for (let i = 0; i < n - 1; i++) {
                    this.highlightPseudo(0);
                    for (let j = 0; j < n - i - 1; j++) {
                        this.highlightPseudo(1);
                        if (!this.isRunning) return;

                        await this.highlightBars([j, j + 1], 'bar-comparing', this.speed);
                        this.updateStats('comparisons');
                        this.highlightPseudo(2);
                        if (this.array[j] > this.array[j + 1]) {
                            this.highlightPseudo(3);
                            await this.swapBars(j, j + 1);
                        }
                    }
                    this.highlightPseudo(4);
                    await this.highlightBars([n - i - 1], 'bar-sorted', 100); // Mark as sorted
                }
                if (n > 0) await this.highlightBars([0], 'bar-sorted', 100); // Mark the last element if exists
                this.clearPseudoHighlight();
            }

            async selectionSort() {
                const n = this.array.length;
                for (let i = 0; i < n - 1; i++) {
                    if (!this.isRunning) return;

                    this.highlightPseudo(0);

                    let minIdx = i;
                    this.highlightPseudo(1);
                    for (let j = i + 1; j < n; j++) {
                        this.highlightPseudo(2);
                        await this.highlightBars([j, minIdx], 'bar-comparing', this.speed);
                        this.updateStats('comparisons');

                        this.highlightPseudo(3);
                        if (this.array[j] < this.array[minIdx]) {
                            this.highlightPseudo(4);
                            minIdx = j;
                        }
                    }

                    if (minIdx !== i) {
                        this.highlightPseudo(5);
                        await this.swapBars(i, minIdx);
                    }
                    await this.highlightBars([i], 'bar-sorted', 100);
                }
                if (n > 0) await this.highlightBars([n - 1], 'bar-sorted', 100);
                this.clearPseudoHighlight();
            }

            async insertionSort() {
                const n = this.array.length;
                if (n > 0) await this.highlightBars([0], 'bar-sorted', 100); // First element is trivially sorted

                for (let i = 1; i < n; i++) {
                    if (!this.isRunning) return;

                    this.highlightPseudo(0);

                    let key = this.array[i];
                    this.highlightPseudo(1);
                    let j = i - 1;
                    this.highlightPseudo(2);

                    // Highlight the element being inserted
                    await this.highlightBars([i], 'bar-comparing', this.speed);

                    while (j >= 0 && this.array[j] > key) {
                        if (!this.isRunning) return;

                        this.highlightPseudo(3);

                        await this.highlightBars([j, j + 1], 'bar-comparing', this.speed);
                        this.updateStats('comparisons');

                        this.array[j + 1] = this.array[j];
                        const bars = document.querySelectorAll('.bar');
                        if (bars[j + 1]) {
                            bars[j + 1].style.height = bars[j].style.height;
                            if (bars[j+1]._tippy) bars[j + 1].setAttribute('data-tippy-content', `Value: ${this.array[j+1]}, Index: ${j+1}`);
                        }


                        j--;
                        this.updateStats('swaps'); // This is more of a shift
                        this.highlightPseudo(4);
                    }

                    this.array[j + 1] = key;
                    this.highlightPseudo(5);
                    const bars = document.querySelectorAll('.bar');
                    if (bars[j + 1]) {
                        bars[j + 1].style.height = `${key}px`;
                         if (bars[j+1]._tippy) bars[j + 1].setAttribute('data-tippy-content', `Value: ${key}, Index: ${j+1}`);
                    }


                    // Mark all elements up to i as sorted (conceptually)
                    for(let k=0; k <= i; k++) {
                        await this.highlightBars([k], 'bar-sorted', 50);
                    }
                }
                this.clearPseudoHighlight();
            }

            async mergeSort(left = 0, right = this.array.length - 1) {
                if (!this.isRunning) return;
                if (left >= right) {
                    if(left >=0 && left < this.array.length) await this.highlightBars([left], 'bar-sorted', this.speed / 2);
                    return;
                }

                const mid = Math.floor((left + right) / 2);
                await this.mergeSort(left, mid);
                await this.mergeSort(mid + 1, right);
                await this.merge(left, mid, right);
            }

            async merge(left, mid, right) {
                if (!this.isRunning) return;

                const leftArr = this.array.slice(left, mid + 1);
                const rightArr = this.array.slice(mid + 1, right + 1);
                const bars = document.querySelectorAll('.bar');

                let i = 0, j = 0, k = left;

                while (i < leftArr.length && j < rightArr.length) {
                    if (!this.isRunning) return;

                    // Highlight elements being compared from subarrays, and target position k
                    await this.highlightBars([left + i, mid + 1 + j, k], 'bar-comparing', this.speed);
                    this.updateStats('comparisons');

                    if (leftArr[i] <= rightArr[j]) {
                        this.array[k] = leftArr[i];
                        i++;
                    } else {
                        this.array[k] = rightArr[j];
                        j++;
                    }
                    if (bars[k]) {
                        bars[k].style.height = `${this.array[k]}px`;
                        if (bars[k]._tippy) bars[k].setAttribute('data-tippy-content', `Value: ${this.array[k]}, Index: ${k}`);
                    }
                    await this.highlightBars([k], 'bar-swapping', this.speed / 2); // Show placement
                    this.updateStats('arrayAccess'); // For write
                    k++;
                }

                while (i < leftArr.length) {
                    if (!this.isRunning) return;
                    this.array[k] = leftArr[i];
                    if (bars[k]) {
                        bars[k].style.height = `${this.array[k]}px`;
                        if (bars[k]._tippy) bars[k].setAttribute('data-tippy-content', `Value: ${this.array[k]}, Index: ${k}`);
                    }
                    await this.highlightBars([k], 'bar-swapping', this.speed / 2);
                    this.updateStats('arrayAccess');
                    i++;
                    k++;
                }

                while (j < rightArr.length) {
                    if (!this.isRunning) return;
                    this.array[k] = rightArr[j];
                     if (bars[k]) {
                        bars[k].style.height = `${this.array[k]}px`;
                        if (bars[k]._tippy) bars[k].setAttribute('data-tippy-content', `Value: ${this.array[k]}, Index: ${k}`);
                    }
                    await this.highlightBars([k], 'bar-swapping', this.speed / 2);
                    this.updateStats('arrayAccess');
                    j++;
                    k++;
                }
                 for(let l_idx = left; l_idx <= right; l_idx++){
                    await this.highlightBars([l_idx], 'bar-sorted', 50);
                }
            }

            async quickSort(low = 0, high = this.array.length - 1) {
                if (!this.isRunning) return;
                if (low < high) {
                    const pi = await this.partition(low, high);
                    await this.highlightBars([pi], 'bar-sorted', 100); // Pivot is in place

                    await this.quickSort(low, pi - 1);
                    await this.quickSort(pi + 1, high);
                } else if (low === high && low >= 0 && low < this.array.length) {
                     await this.highlightBars([low], 'bar-sorted', 100); // Single element is sorted
                }
            }

            async partition(low, high) {
                const pivot = this.array[high];
                await this.highlightBars([high], 'bar-comparing', this.speed); // Highlight pivot
                let i = low - 1; // Index of smaller element

                for (let j = low; j < high; j++) {
                    if (!this.isRunning) return i + 1; // Exit if stopped

                    await this.highlightBars([j, high], 'bar-comparing', this.speed);
                    this.updateStats('comparisons');

                    if (this.array[j] < pivot) {
                        i++;
                        if (i !== j) { // Avoid swapping with itself
                           await this.swapBars(i, j);
                        }
                    }
                }
                // Swap pivot to its correct position
                if ((i + 1) !== high) { // Avoid swapping with itself
                    await this.swapBars(i + 1, high);
                }
                return i + 1; // Return partition index
            }

            async heapSort() {
                const n = this.array.length;

                // Build max heap
                for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                    if (!this.isRunning) return;
                    await this.heapify(n, i);
                }

                // Extract elements from heap one by one
                for (let i = n - 1; i > 0; i--) {
                    if (!this.isRunning) return;

                    await this.swapBars(0, i);
                    await this.highlightBars([i], 'bar-sorted', 100); // Element is now sorted
                    await this.heapify(i, 0); // Heapify the reduced heap
                }
                if (n > 0) await this.highlightBars([0], 'bar-sorted', 100); // Last element
            }

            async heapify(n, i) { // n is size of heap, i is root of subtree
                if (!this.isRunning) return;
                let largest = i;
                let left = 2 * i + 1;
                let right = 2 * i + 2;

                // Highlight root and potential children
                const toHighlight = [i];
                if (left < n) toHighlight.push(left);
                if (right < n) toHighlight.push(right);
                await this.highlightBars(toHighlight, 'bar-comparing', this.speed / 2);


                if (left < n) {
                    this.updateStats('comparisons');
                    if (this.array[left] > this.array[largest]) {
                        largest = left;
                    }
                }

                if (right < n) {
                    this.updateStats('comparisons');
                    if (this.array[right] > this.array[largest]) {
                        largest = right;
                    }
                }

                if (largest !== i) {
                    await this.swapBars(i, largest);
                    await this.heapify(n, largest); // Recursively heapify the affected sub-tree
                }
            }


            async startSorting() {
                if (this.isRunning) return;

                this.isRunning = true;
                this.isPaused = false;
                this.stepHistory = [ [...this.array] ];
                this.stepIndex = 0;
                this.resetStats();
                this.stats.startTime = Date.now();

                // Clear previous sorted states from bars
                document.querySelectorAll('.bar').forEach(bar => {
                    bar.classList.remove('bar-sorted');
                    bar.style.background = 'linear-gradient(45deg, #667eea, #764ba2)'; // Reset to default color
                });


                const algorithm = document.getElementById('algorithmSelect').value;
                const startBtn = document.getElementById('startBtn');

                startBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Running...';
                startBtn.disabled = true;
                document.getElementById('resetBtn').disabled = true;
                document.getElementById('arraySize').disabled = true;
                document.getElementById('algorithmSelect').disabled = true;


                try {
                    switch (algorithm) {
                        case 'bubble':
                            await this.bubbleSort();
                            break;
                        case 'selection':
                            await this.selectionSort();
                            break;
                        case 'insertion':
                            await this.insertionSort();
                            break;
                        case 'merge':
                            await this.mergeSort();
                            // Final pass to ensure all are marked sorted for merge sort
                            if(this.isRunning) await this.highlightAllSorted();
                            break;
                        case 'quick':
                            await this.quickSort();
                             // Final pass to ensure all are marked sorted for quick sort
                            if(this.isRunning) await this.highlightAllSorted();
                            break;
                        case 'heap':
                            await this.heapSort();
                            break;
                    }

                    if (this.isRunning) { // If not reset during execution
                        await this.celebrateCompletion();
                    }
                } catch (error) {
                    console.error('Sorting error:', error);
                     // Show a user-friendly error message in the UI if possible
                    const vizArea = document.getElementById('visualization');
                    if (vizArea) {
                        const errorMsg = document.createElement('p');
                        errorMsg.textContent = 'An error occurred during sorting. Please reset and try again.';
                        errorMsg.className = 'text-red-500 text-center mt-4';
                        vizArea.appendChild(errorMsg);
                    }
                } finally {
                    this.isRunning = false;
                    startBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Start';
                    startBtn.disabled = false;
                    document.getElementById('resetBtn').disabled = false;
                    document.getElementById('arraySize').disabled = false;
                    document.getElementById('algorithmSelect').disabled = false;
                }
            }

            async celebrateCompletion() {
                const bars = document.querySelectorAll('.bar');

                // Ensure all bars are marked with the final sorted color
                for (let i = 0; i < bars.length; i++) {
                    bars[i].classList.remove('bar-comparing', 'bar-swapping');
                    bars[i].classList.add('bar-sorted'); // Ensure the sorted class is applied
                     // Explicitly set the sorted background
                    bars[i].style.background = 'linear-gradient(45deg, #a8e6cf, #7fcdcd)';
                }


                // Rainbow animation
                for (let i = 0; i < bars.length; i++) {
                    if (!this.isRunning && i > 0) break; // Stop if reset
                    const hue = (i * 360) / bars.length;
                    bars[i].style.background = `linear-gradient(45deg, hsl(${hue}, 70%, 60%), hsl(${hue + 30}, 70%, 50%))`;
                    await this.sleep(Math.max(5, 50 - bars.length / 2)); // Faster for more bars
                }

                // Fireworks effect
                if (this.isRunning && typeof anime !== 'undefined') { // Only run if not reset
                    anime({
                        targets: '.bar',
                        scale: [
                            { value: 1.1, duration: 200 },
                            { value: 1, duration: 200 }
                        ],
                        delay: anime.stagger(30),
                        easing: 'easeInOutQuad'
                    });
                }
                 // Reset to standard sorted color after celebration
                await this.sleep(bars.length * Math.max(5, 50 - bars.length / 2) + 500); // Wait for rainbow + fireworks
                if (!this.isRunning) { // If reset during celebration, just ensure default color
                     bars.forEach(bar => bar.style.background = 'linear-gradient(45deg, #667eea, #764ba2)');
                } else {
                    bars.forEach(bar => {
                        bar.style.background = 'linear-gradient(45deg, #a8e6cf, #7fcdcd)';
                        bar.classList.add('bar-sorted');
                    });
                }
            }


            async highlightAllSorted() {
                // const bars = document.querySelectorAll('.bar'); // Not needed, already have this.array
                for (let i = 0; i < this.array.length; i++) {
                    if (!this.isRunning) return;
                    await this.highlightBars([i], 'bar-sorted', Math.max(10, 50 - this.array.length/2));
                }
            }

            resetArray() {
                if (this.isRunning) {
                    this.isRunning = false; // Signal to stop ongoing sort
                    this.isPaused = false;
                    if (this.pauseResolver) this.pauseResolver();
                // Enable controls immediately
                    const startBtn = document.getElementById('startBtn');
                    startBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Start';
                    startBtn.disabled = false;
                    document.getElementById('resetBtn').disabled = false;
                    document.getElementById('arraySize').disabled = false;
                    document.getElementById('algorithmSelect').disabled = false;
                }
                 // Remove any error messages from visualization area
                const vizArea = document.getElementById('visualization');
                const errorMsg = vizArea.querySelector('p.text-red-500');
                if (errorMsg) {
                    errorMsg.remove();
                }

                this.generateArray(); // Generates new array and calls renderArray & resetStats
                this.stepHistory = [ [...this.array] ];
                this.stepIndex = 0;
                // Clear any lingering highlights or special styles from bars
                document.querySelectorAll('.bar').forEach(bar => {
                    bar.classList.remove('bar-comparing', 'bar-swapping', 'bar-sorted');
                    bar.style.background = 'linear-gradient(45deg, #667eea, #764ba2)'; // Reset to default color
                });
            }


            resetStats() {
                this.stats = { comparisons: 0, swaps: 0, arrayAccess: 0, startTime: Date.now() };
                this.updateStatsDisplay();
            }

            updateStats(type) {
                if (!this.isRunning) return; // Don't update if not running
                this.stats[type]++;
                if (type === 'comparisons' || type === 'swaps') {
                    this.stats.arrayAccess += (type === 'comparisons' ? 2 : 4); // Approx accesses
                } else { // For direct array writes in merge sort etc.
                    this.stats.arrayAccess++;
                }
                this.updateStatsDisplay();
            }

            updateStatsDisplay() {
                document.getElementById('comparisons').textContent = this.stats.comparisons;
                document.getElementById('swaps').textContent = this.stats.swaps;
                document.getElementById('arrayAccess').textContent = this.stats.arrayAccess;
                if (this.isRunning) {
                    document.getElementById('timeElapsed').textContent = Date.now() - this.stats.startTime;
                } else {
                     document.getElementById('timeElapsed').textContent = 0;
                }
            }

            updateAlgorithmInfo() {
                const algorithm = document.getElementById('algorithmSelect').value;
                const info = this.algorithms[algorithm];

                document.getElementById('algoName').textContent = info.name;
                document.getElementById('algoDesc').textContent = info.description;
                document.getElementById('avgComplexity').textContent = info.avgComplexity;
                document.getElementById('bestComplexity').textContent = info.bestComplexity;
                document.getElementById('worstComplexity').textContent = info.worstComplexity;
                this.displayPseudocode();
            }

            displayPseudocode() {
                const algorithm = document.getElementById('algorithmSelect').value;
                const codeLines = this.pseudocodes[algorithm] || [];
                const container = document.getElementById('pseudocode');
                if (!container) return;
                container.innerHTML = codeLines.map(line => `<span class="pseudocode-line">${line}</span>`).join('\n');
            }

            highlightPseudo(index) {
                const lines = document.querySelectorAll('#pseudocode .pseudocode-line');
                lines.forEach((el, i) => {
                    if (i === index) {
                        el.classList.add('highlight');
                    } else {
                        el.classList.remove('highlight');
                    }
                });
            }

            clearPseudoHighlight() {
                const lines = document.querySelectorAll('#pseudocode .pseudocode-line');
                lines.forEach(el => el.classList.remove('highlight'));
            }

            createComplexityChart() {
                const ctxElement = document.getElementById('complexityChart');
                if (!ctxElement) {
                    console.error("Canvas element for complexity chart not found.");
                    return;
                }
                const ctx = ctxElement.getContext('2d');


                const data = {
                    labels: ['10', '50', '100', '500', '1000'], // Number of elements (n)
                    datasets: [
                        {
                            label: 'O(n²) - Bubble, Selection, Insertion',
                            data: [100, 2500, 10000, 250000, 1000000], // n*n
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            tension: 0.4
                        },
                        {
                            label: 'O(n log n) - Merge, Heap, Quick(avg)',
                            data: [
                                10 * Math.log2(10),  // approx 33
                                50 * Math.log2(50),  // approx 282
                                100 * Math.log2(100), // approx 664
                                500 * Math.log2(500), // approx 4482
                                1000 * Math.log2(1000) // approx 9965
                            ].map(val => Math.round(val)),
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            tension: 0.4
                        },
                        {
                            label: 'O(n) - Best case (e.g., Bubble sorted)',
                            data: [10, 50, 100, 500, 1000], // n
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4
                        }
                    ]
                };
                try {
                    if (typeof Chart !== 'undefined') {
                        new Chart(ctx, {
                            type: 'line',
                            data: data,
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Time Complexity Comparison',
                                        color: 'white',
                                        font: { size: 16 }
                                    },
                                    legend: {
                                        labels: {
                                            color: 'white'
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Number of Elements (n)',
                                            color: 'white'
                                        },
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Number of Operations (approx.)',
                                            color: 'white'
                                        },
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgba(255, 255, 255, 0.1)'
                                        },
                                        type: 'logarithmic',
                                        afterBuildTicks: chart => {
                                            if (!chart || !chart.scales || !chart.scales.y || typeof chart.scales.y.max === 'undefined') {
                                                console.warn('Chart y-axis not ready during afterBuildTicks for complexity chart.');
                                                // Attempt to set some default ticks if scale is partially ready but max is not.
                                                if (chart && chart.scales && chart.scales.y) {
                                                     chart.scales.y.ticks = [{value: 1, label: '1'}, {value: 10, label: '10'}, {value: 100, label: '100'}, {value: 1000, label: '1k'}, {value: 10000, label: '10k'}, {value: 100000, label: '100k'}, {value: 1000000, label: '1M'}];
                                                }
                                                return;
                                            }
                                            const ticks = [];
                                            let currentTick = 1;
                                            // Ensure y.max is a number and positive before proceeding
                                            const yMax = Number(chart.scales.y.max);
                                            if (isNaN(yMax) || yMax <= 0) {
                                                console.warn('Chart y-axis max value is invalid for logarithmic scale ticks.');
                                                 chart.scales.y.ticks = [{value: 1, label: '1'}, {value: 10, label: '10'}, {value: 100, label: '100'}]; // Fallback ticks
                                                return;
                                            }

                                            while (currentTick <= yMax) {
                                                ticks.push(currentTick);
                                                if (currentTick < 10) currentTick +=1;
                                                else if (currentTick < 100) currentTick +=10;
                                                else if (currentTick < 1000) currentTick +=100;
                                                else if (currentTick < 10000) currentTick +=1000;
                                                else if (currentTick < 100000) currentTick +=10000;
                                                else currentTick +=100000;

                                                if (ticks.length > 20 || currentTick > 2000000) break; // Limit number of ticks and prevent infinite loops
                                            }
                                            chart.scales.y.ticks = ticks.map(value => ({value, label: value >= 1000000 ? `${value/1000000}M` : (value >= 1000 ? `${value/1000}k` : value.toString())}));
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        console.error("Chart.js library not loaded.");
                    }
                } catch(e) {
                    console.error("Error creating complexity chart:", e);
                }
            }


            initializeAnimations() {
                // Typed.js animation for title
                setTimeout(() => {
                    try {
                        const typedTitleElement = document.getElementById('typed-title');
                        if (typedTitleElement) {
                            if (typeof Typed !== 'undefined') {
                                new Typed('#typed-title', {
                                    strings: ['Algorithm Visualizer', 'Visualize Sorting', 'Sorting Algorithms'],
                                    typeSpeed: 50,
                                    backSpeed: 30,
                                    backDelay: 2000,
                                    loop: true
                                });
                            } else {
                                console.warn('Typed.js library not loaded after a short delay. Setting static title.');
                                typedTitleElement.textContent = 'Algorithm Visualizer';
                            }
                        } else {
                             console.warn('#typed-title element not found for animation.');
                        }
                    } catch (e) {
                        console.error("Error initializing Typed.js:", e);
                        const typedTitleElement = document.getElementById('typed-title');
                        if (typedTitleElement) {
                            typedTitleElement.textContent = 'Algorithm Visualizer'; // Fallback title
                        }
                    }
                }, 0);

                // ScrollReveal animations for sections
                try {
                    if (typeof ScrollReveal !== 'undefined') {
                        ScrollReveal().reveal('#controls', { delay: 200, distance: '50px', origin: 'top', duration: 1000 });
                        ScrollReveal().reveal('#visualization', { delay: 400, distance: '50px', origin: 'left', duration: 1000 });
                        ScrollReveal().reveal('#algorithmInfo', { delay: 600, distance: '50px', origin: 'right', duration: 1000 });
                        ScrollReveal().reveal('.complexity-chart', { delay: 700, distance: '50px', origin: 'left', duration: 1000 });
                        ScrollReveal().reveal('#statistics', { delay: 800, distance: '50px', origin: 'bottom', duration: 1000 });
                    } else {
                        console.warn('ScrollReveal library not loaded.');
                    }
                } catch (e) {
                    console.error("Error initializing ScrollReveal:", e);
                }


                // GSAP animations for interactive elements (buttons)
                try {
                    if (typeof gsap !== 'undefined') {
                        gsap.from('.glow-button', {
                            duration: 1,
                            scale: 0.8,
                            // opacity: 0, // Removed to prevent buttons from becoming invisible
                            stagger: 0.2,
                            ease: 'back.out(1.7)',
                            delay: 0.5 // Shortened delay
                        });
                    } else {
                        console.warn('GSAP library not loaded.');
                    }
                } catch (e) {
                    console.error("Error initializing GSAP animations:", e);
                }


                // Continuous stats update animation (only time)
                setInterval(() => {
                    if (this.isRunning) {
                        this.updateStatsDisplay(); // Update time elapsed
                        if (typeof gsap !== 'undefined') {
                            gsap.to('#timeElapsed', {
                                duration: 0.3,
                                scale: 1.05,
                                yoyo: true,
                                repeat: 1,
                                ease: 'power2.inOut'
                            });
                        }
                    }
                }, 100); // Update time more frequently for smoother display
            }

            async checkPaused() {
                if (this.isPaused) {
                    await new Promise(resolve => this.pauseResolver = resolve);
                    this.pauseResolver = null;
                    if (this.stepMode) this.isPaused = true;
                }
            }

            recordStep() {
                this.stepHistory.push([...this.array]);
                this.stepIndex = this.stepHistory.length - 1;
            }

            showSnapshot(snapshot) {
                const bars = document.querySelectorAll('.bar');
                snapshot.forEach((val, idx) => {
                    if (bars[idx]) {
                        bars[idx].style.height = `${val}px`;
                        if (bars[idx]._tippy) bars[idx].setAttribute('data-tippy-content', `Value: ${val}, Index: ${idx}`);
                    }
                });
            }

            pause() {
                if (this.isRunning) {
                    this.isPaused = true;
                    this.stepMode = false;
                }
            }

            resume() {
                if (this.isRunning) {
                    this.isPaused = false;
                    this.stepMode = false;
                    if (this.pauseResolver) this.pauseResolver();
                }
            }

            nextStep() {
                if (this.isPaused && this.pauseResolver) {
                    this.isPaused = false;
                    this.stepMode = true;
                    this.pauseResolver();
                }
            }

            previousStep() {
                if (this.isPaused && this.stepIndex > 0) {
                    this.stepIndex--;
                    this.showSnapshot(this.stepHistory[this.stepIndex]);
                }
            }

            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        // Initialize the visualizer when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const visualizer = new SortingVisualizer();

            // Add keyboard shortcuts for Start (Space) and Reset (R)
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && !e.repeat) { // Prevent multiple triggers if key is held down
                    e.preventDefault(); // Prevent page scroll
                    if (!visualizer.isRunning) {
                        document.getElementById('startBtn').click(); // Trigger button click for visual feedback
                    }
                } else if (e.code === 'KeyR' && !e.repeat) {
                    e.preventDefault();
                     document.getElementById('resetBtn').click();
                }
            });

            // Add theme toggle functionality (Dark/Light)
            const themeToggle = document.createElement('button');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Default to dark mode icon
            themeToggle.className = 'fixed top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-all z-50 shadow-lg';
            themeToggle.setAttribute('aria-label', 'Toggle theme');
            let isLightTheme = false;

            themeToggle.addEventListener('click', () => {
                isLightTheme = !isLightTheme;
                document.body.classList.toggle('light-theme', isLightTheme);
                document.body.classList.toggle('bg-gray-900', !isLightTheme);
                document.body.classList.toggle('text-white', !isLightTheme);
                document.body.classList.toggle('bg-gray-100', isLightTheme); // Example light theme background
                document.body.classList.toggle('text-gray-900', isLightTheme); // Example light theme text

                document.querySelectorAll('.glass-effect').forEach(el => {
                    el.classList.toggle('light-theme-glass', isLightTheme);
                });
                 document.querySelectorAll('select, input[type="range"]').forEach(el => {
                    el.classList.toggle('light-theme-input', isLightTheme);
                });


                themeToggle.innerHTML = isLightTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                themeToggle.classList.toggle('bg-gray-800', !isLightTheme);
                themeToggle.classList.toggle('hover:bg-gray-700', !isLightTheme);
                themeToggle.classList.toggle('bg-white', isLightTheme);
                themeToggle.classList.toggle('hover:bg-gray-200', isLightTheme);
                themeToggle.classList.toggle('text-white', !isLightTheme);
                themeToggle.classList.toggle('text-yellow-500', isLightTheme);


            });
            document.body.appendChild(themeToggle);

            // Add CSS for light theme (can be expanded)
            const styleSheet = document.createElement("style");
            styleSheet.innerText = `
                .light-theme .glass-effect {
                    background: rgba(255, 255, 255, 0.7);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    color: #333; /* Text color for glass effect in light mode */
                }
                .light-theme #algorithmSelect, .light-theme input[type="range"] {
                    background-color: #e2e8f0; /* Light gray for inputs */
                    color: #2d3748; /* Darker text for inputs */
                    border-color: #cbd5e0;
                }
                .light-theme label, .light-theme span, .light-theme h2, .light-theme h3, .light-theme h4, .light-theme p, .light-theme div {
                     /* Ensure text is readable in light mode */
                }
                .light-theme .text-gray-300 { color: #4a5568; }
                .light-theme .text-gray-400 { color: #718096; }

                /* Ensure chart.js legend and titles are visible in light mode */
                .light-theme .chartjs-legend-item-text, .light-theme .chartjs-title-text { color: #333 !important; }
                .light-theme .chartjs-axis-title-text, .light-theme .chartjs-tick-text { color: #555 !important; }
                .light-theme .chartjs-grid-line { border-color: rgba(0,0,0,0.1) !important; }


                 .light-theme .bar { box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
            `;
            document.head.appendChild(styleSheet);


            // Add floating particles background (subtle)
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'fixed inset-0 pointer-events-none -z-10'; // Ensure it's behind content
            document.body.insertBefore(particlesContainer, document.body.firstChild);

            if (typeof anime !== 'undefined') {
                for (let i = 0; i < 15; i++) { // Reduced number for subtlety
                    const particle = document.createElement('div');
                    particle.className = 'absolute rounded-full';
                    const size = Math.random() * 3 + 1; // Smaller particles
                    particle.style.width = `${size}px`;
                    particle.style.height = particle.style.width;
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.background = `hsla(${Math.random() * 360}, 70%, 70%, 0.2)`; // More transparent
                    particle.style.opacity = '0'; // Start invisible

                    anime({
                        targets: particle,
                        translateY: [anime.random(-50, 50), anime.random(-50, 50)],
                        translateX: [anime.random(-50, 50), anime.random(-50, 50)],
                        scale: [0.5, anime.random(1, 1.5)],
                        opacity: [0, anime.random(0.1, 0.3), 0], // Fade in and out
                        duration: Math.random() * 4000 + 3000,
                        loop: true,
                        direction: 'alternate',
                        easing: 'easeInOutSine',
                        delay: Math.random() * 1000
                    });
                    particlesContainer.appendChild(particle);
                }
            } else {
                console.warn('Anime.js not loaded, particle animations disabled.');
            }


            // Performance monitoring (FPS - optional, logs to console)
            let frameCount = 0;
            let lastTime = performance.now();
            function measureFPS() {
                frameCount++;
                const currentTime = performance.now();
                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    if (visualizer.isRunning) { // Log FPS only when sorting
                        // console.log(`FPS: ${fps}`);
                    }
                    frameCount = 0;
                    lastTime = currentTime;
                }
                requestAnimationFrame(measureFPS);
            }
            // measureFPS(); // Uncomment to enable FPS logging

            // Sound effects (optional, requires user interaction to enable audio context usually)
            let audioContext;
            try {
                 audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn("Web Audio API is not supported in this browser.");
            }


            function playTone(frequency, duration, type = 'sine', volume = 0.05) {
                if (!audioContext || !soundEnabled) return;
                 if (audioContext.state === 'suspended') { // Attempt to resume context on interaction
                    audioContext.resume().catch(e => console.warn("Could not resume audio context:", e));
                }
                if (audioContext.state !== 'running') return; // Don't play if context isn't running

                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = type;

                gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration / 1000);
            }

            // Add sound toggle button
            let soundEnabled = false;
            const soundToggle = document.createElement('button');
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            soundToggle.className = 'fixed top-4 right-16 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-all z-50 shadow-lg';
            soundToggle.setAttribute('aria-label', 'Toggle sound');

            soundToggle.addEventListener('click', () => {
                soundEnabled = !soundEnabled;
                soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
                if (soundEnabled && audioContext && audioContext.state === 'suspended') {
                    audioContext.resume().catch(e => console.warn("Could not resume audio context on sound toggle:", e));
                }
                // Update classes for light/dark mode consistency
                const isLight = document.body.classList.contains('light-theme');
                soundToggle.classList.toggle('bg-gray-800', !isLight);
                soundToggle.classList.toggle('hover:bg-gray-700', !isLight);
                soundToggle.classList.toggle('bg-white', isLight);
                soundToggle.classList.toggle('hover:bg-gray-200', isLight);
                soundToggle.classList.toggle('text-white', !isLight);
                soundToggle.classList.toggle('text-blue-500', isLight && soundEnabled);
                soundToggle.classList.toggle('text-gray-500', isLight && !soundEnabled);


                if (soundEnabled) playTone(440, 100); // Play a test tone
            });
            document.body.appendChild(soundToggle);

            // Attach sound playing to visualizer actions (example for swap)
            const originalSwapBars = visualizer.swapBars.bind(visualizer);
            visualizer.swapBars = async function(i, j) {
                if (soundEnabled && audioContext && this.array[i] !== undefined && this.array[j] !== undefined) {
                    const val1 = this.array[i];
                    // Map value to frequency (e.g., 100-1000 Hz for values 0-350)
                    const freq1 = 100 + (val1 / 350) * 900;
                    playTone(freq1, 50, 'triangle');
                }
                await originalSwapBars(i, j);
            };
             const originalHighlightBars = visualizer.highlightBars.bind(visualizer);
            visualizer.highlightBars = async function(indices, className, duration) {
                if (soundEnabled && audioContext && className === 'bar-comparing' && indices.length > 0 && this.array[indices[0]] !== undefined) {
                    const val = this.array[indices[0]];
                    const freq = 200 + (val / 350) * 600;
                    playTone(freq, Math.min(50, duration), 'sine', 0.03);
                }
                await originalHighlightBars(indices, className, duration);
            };


            // Enhanced tooltips with more context
            if (typeof tippy !== 'undefined') {
                tippy('#algorithmSelect', { content: 'Select a sorting algorithm to visualize its process and complexity.', theme: 'dark', placement: 'bottom' });
                tippy('#arraySize', { content: 'Adjust the number of elements in the array (10-100). Larger arrays take longer.', theme: 'dark', placement: 'bottom' });
                tippy('#speed', { content: 'Control the animation speed (1: slowest, 10: fastest).', theme: 'dark', placement: 'bottom' });
            }


            console.log('🎉 Sorting Algorithm Visualizer initialized successfully!');
            console.log('⌨️ Keyboard Shortcuts: Space = Start/Pause, R = Reset');
        });
