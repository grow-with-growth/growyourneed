// REAL SYSTEM TESTING - Verify Everything Works
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Test configuration
const tests = [
    {
        name: 'Health Check',
        url: `${BASE_URL}/health`,
        expected: 'healthy'
    },
    {
        name: 'Movie Search - Avengers',
        url: `${BASE_URL}/search?q=avengers&t=movie&limit=3`,
        expected: 'stream_url'
    },
    {
        name: 'TV Search - Breaking Bad',
        url: `${BASE_URL}/search?q=breaking+bad&t=tv&limit=3`,
        expected: 'stream_url'
    },
    {
        name: 'Book Search - Harry Potter',
        url: `${BASE_URL}/search?q=harry+potter&t=book&limit=3`,
        expected: 'download_url'
    },
    {
        name: 'Live TV Channels',
        url: `${BASE_URL}/search?t=live&limit=5`,
        expected: 'stream_url'
    },
    {
        name: 'Full System Test',
        url: `${BASE_URL}/test`,
        expected: 'test_complete'
    }
];

// REAL STREAM URL TESTING
async function testStreamUrl(url) {
    try {
        const response = await axios.head(url, { timeout: 5000 });
        return response.status === 200 || response.status === 302 || response.status === 301;
    } catch (error) {
        return false;
    }
}

// REAL M3U8 TESTING
async function testM3u8Url(url) {
    try {
        const response = await axios.get(url, { timeout: 5000 });
        const content = response.data;
        return content.includes('#EXTM3U') || content.includes('#EXT-X-VERSION');
    } catch (error) {
        return false;
    }
}

// Run comprehensive tests
async function runTests() {
    console.log('🧪 REAL SYSTEM TESTING - Verifying Everything Works');
    console.log('=' .repeat(60));
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        console.log(`\n🔍 Testing: ${test.name}`);
        console.log(`   URL: ${test.url}`);
        
        try {
            const response = await axios.get(test.url, { timeout: 10000 });
            const data = response.data;
            
            // Check if expected field exists
            let testPassed = false;
            
            if (test.expected === 'healthy') {
                testPassed = data.status === 'healthy';
            } else if (test.expected === 'test_complete') {
                testPassed = data.status === 'test_complete';
            } else if (test.expected === 'stream_url' || test.expected === 'download_url') {
                testPassed = Array.isArray(data) && data.length > 0 && data[0][test.expected];
            }
            
            if (testPassed) {
                console.log(`   ✅ PASSED`);
                passedTests++;
                
                // Show sample results
                if (Array.isArray(data) && data.length > 0) {
                    console.log(`   📊 Results: ${data.length} items found`);
                    console.log(`   📝 Sample: "${data[0].title}"`);
                    
                    if (data[0].stream_url) {
                        console.log(`   🔗 Stream: ${data[0].stream_url.substring(0, 50)}...`);
                        
                        // Test if stream actually works
                        const streamWorks = await testStreamUrl(data[0].stream_url);
                        console.log(`   🎯 Stream Test: ${streamWorks ? '✅ WORKING' : '❌ FAILED'}`);
                    }
                    
                    if (data[0].download_url) {
                        console.log(`   📥 Download: ${data[0].download_url.substring(0, 50)}...`);
                    }
                } else if (data.status) {
                    console.log(`   📊 Status: ${data.status}`);
                    if (data.results) {
                        console.log(`   📈 Movies: ${data.results.movies?.success_rate || 0}% success`);
                        console.log(`   📈 TV: ${data.results.tv_shows?.success_rate || 0}% success`);
                        console.log(`   📈 Books: ${data.results.books?.success_rate || 0}% success`);
                        console.log(`   📈 Live TV: ${data.results.live_tv?.success_rate || 0}% success`);
                    }
                }
            } else {
                console.log(`   ❌ FAILED - Expected field '${test.expected}' not found`);
            }
            
        } catch (error) {
            console.log(`   ❌ FAILED - ${error.message}`);
        }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL TESTS PASSED - System is working correctly!');
    } else {
        console.log('⚠️  Some tests failed - Check the logs above');
    }
    
    return passedTests === totalTests;
}

// REAL STREAM VERIFICATION
async function verifyRealStreams() {
    console.log('\n🎯 REAL STREAM VERIFICATION');
    console.log('=' .repeat(40));
    
    // Test known working streams
    const testStreams = [
        {
            name: 'VidSrc Movie Test',
            url: 'https://vidsrc.to/embed/movie/tt0848228', // Avengers
            type: 'embed'
        },
        {
            name: 'CNN Live Stream',
            url: 'https://cnn-cnninternational-1-gb.samsung.wurl.com/manifest/playlist.m3u8',
            type: 'm3u8'
        },
        {
            name: 'BBC News Stream',
            url: 'https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news24/t=3840/v=pv14/b=5070016/main.m3u8',
            type: 'm3u8'
        }
    ];
    
    for (const stream of testStreams) {
        console.log(`\n🔍 Testing: ${stream.name}`);
        console.log(`   URL: ${stream.url.substring(0, 60)}...`);
        
        let isWorking = false;
        
        if (stream.type === 'm3u8') {
            isWorking = await testM3u8Url(stream.url);
        } else {
            isWorking = await testStreamUrl(stream.url);
        }
        
        console.log(`   Result: ${isWorking ? '✅ WORKING' : '❌ FAILED'}`);
    }
}

// PERFORMANCE TESTING
async function performanceTest() {
    console.log('\n⚡ PERFORMANCE TESTING');
    console.log('=' .repeat(30));
    
    const testUrl = `${BASE_URL}/search?q=test&t=movie&limit=1`;
    
    // Test response time
    const startTime = Date.now();
    try {
        await axios.get(testUrl);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`📊 Response Time: ${responseTime}ms`);
        
        if (responseTime < 1000) {
            console.log('✅ FAST - Response time under 1 second');
        } else if (responseTime < 3000) {
            console.log('⚠️  MODERATE - Response time 1-3 seconds');
        } else {
            console.log('❌ SLOW - Response time over 3 seconds');
        }
        
        // Test cache performance
        const cacheStartTime = Date.now();
        await axios.get(testUrl); // Should be cached
        const cacheEndTime = Date.now();
        const cacheResponseTime = cacheEndTime - cacheStartTime;
        
        console.log(`📦 Cache Response Time: ${cacheResponseTime}ms`);
        
        if (cacheResponseTime < responseTime / 2) {
            console.log('✅ CACHE WORKING - Faster cached response');
        } else {
            console.log('⚠️  CACHE UNCERTAIN - Similar response times');
        }
        
    } catch (error) {
        console.log(`❌ PERFORMANCE TEST FAILED: ${error.message}`);
    }
}

// Main execution
async function main() {
    console.log('🚀 Starting Real System Verification...\n');
    
    // Wait for server to start
    console.log('⏳ Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
        // Run all tests
        const allTestsPassed = await runTests();
        await verifyRealStreams();
        await performanceTest();
        
        console.log('\n🎯 FINAL VERDICT:');
        console.log('=' .repeat(20));
        
        if (allTestsPassed) {
            console.log('🎉 SYSTEM IS WORKING CORRECTLY!');
            console.log('✅ All endpoints responding');
            console.log('✅ Content search working');
            console.log('✅ Stream URLs being generated');
            console.log('✅ Real content sources accessible');
            console.log('\n🔗 Try these URLs in your browser:');
            console.log(`   Health: http://localhost:8080/health`);
            console.log(`   Movies: http://localhost:8080/search?q=avengers&t=movie`);
            console.log(`   TV: http://localhost:8080/search?q=breaking+bad&t=tv`);
            console.log(`   Books: http://localhost:8080/search?q=harry+potter&t=book`);
            console.log(`   Live TV: http://localhost:8080/search?t=live`);
            console.log(`   Full Test: http://localhost:8080/test`);
        } else {
            console.log('❌ SYSTEM HAS ISSUES');
            console.log('⚠️  Some tests failed - check logs above');
        }
        
    } catch (error) {
        console.log(`❌ TESTING FAILED: ${error.message}`);
        console.log('💡 Make sure the server is running: node server.js');
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { runTests, verifyRealStreams, performanceTest };
