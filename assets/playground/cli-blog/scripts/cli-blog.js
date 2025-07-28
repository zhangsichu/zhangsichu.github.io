document.addEventListener('DOMContentLoaded', () => {
	var jsonDataPath = "/assets/js/data/search.json";
	var ask = 'guest' + '@' + 'ZhangSichu-Blog' + ':' + '/' + '$' + '&nbsp;';

	var display = null;
	var form = null;
	var command = null;
	var screen = null;
	var prompt = null;

	var postData = null;
	var post_id = 0;

	var categoryData = null;

	var tagData = null;

	window.doKey = function (event) {
		if (form != null && form.input != null) {
			form.input.focus();
		}
		if (navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("Trident") > -1) {
			if (event && event.keyCode == 13) {
				doCmd(form.input.value);
			}
		}
		return false;
	}

	window.doCmd = function (input) {
		display.innerHTML += "<pre>" + ask + input + '</pre>';
		scroller();

		inputLowerCase = input.toLowerCase();
		form.input.value = "";
		command.innerHTML = "";

		if (inputLowerCase == "restart" ||
			inputLowerCase == "reboot") {
			window.location.reload(true);
			return false;
		}

		if (inputLowerCase == "exit" ||
			inputLowerCase == 'halt' ||
			inputLowerCase == 'shutdown') {
			window.opener = null;
			window.close();
			return false;
		}

		if (inputLowerCase == 'cls' ||
			inputLowerCase == 'clear'
		) {
			display.innerHTML = '';
			return false;
		}

		if (inputLowerCase == 'back') {
			history.go(-1);
			return false;
		}

		if (inputLowerCase == 'gui' || inputLowerCase == 'startx') {
			document.location.href = "/";
			return false;
		}

		if (input.substring(0, input.indexOf(' ')).toLowerCase() == 'google') {
			qt = input.substr(input.indexOf(' ') + 1);
			window.open("https://www.google.com/search?q=" + qt);
			return false;
		}

		if (inputLowerCase == 'help' || inputLowerCase == 'h' || inputLowerCase == '?') {
			display.innerHTML += "<table><tr><td colspan='2'>ZhangSichu's CLI Blog (c) 2006-2007 ZhangSichu<br /><br /></td><td></td></tr><tr><td colspan='2'>command, alias required [optional]: description<br /><br /></td><td></td></tr><tr><td id='frontCell'>help, h, ?:</td><td>Help (this)</td></tr><tr><td>gui, startx:</td><td>Return to GUI (graphical interface) blog</td></tr><tr><td>ls, dir, list:</td><td>List all posts (ordered by ID/date)</td></tr><tr><td>search, find [search terms]:</td><td>Search posts</td></tr><tr><td>preview, preview [post_id]:</td><td>Preview post # (no post_id: preview current)</td></tr><tr><td>current, cursor [post_id]:</td><td>Show current post_id (set if post_id given, nearest higher if no post matches)</td></tr><tr><td>latest, last, l:</td><td>Move to and preview latest post</td></tr><tr><td>next, n:</td><td>Move to and preview next post</td></tr><tr><td>prev, p:</td><td>Move to and preview previous post</td></tr><tr><td>first, f:</td><td> Move to and preview first post</td></tr><tr><td>random, rand, r:</td><td>Preview random post</td></tr><tr><td>categories:</td><td>List categories</td></tr><tr><td>category cat_id:</td><td>List posts in category</td></tr><tr><td>post_id:</td><td>Preview post</td></tr><tr><td>posteddate:</td><td>List all post posted date.</td></tr><tr><td>date:</td><td>Current date/time</td></tr><tr><td>cls:</td><td>Clear screen</td></tr><tr><td>google [keyword]:</td><td>Google search</td></tr><tr><td><u>Notes</u></td><td>On listings (ls, find, category) you can click a title to view the relevant post.</td></tr></table>";
			scroller();
			prompt.style.visibility = 'visible';
			return false;
		}

		var inputLowerCaseCommand = inputLowerCase;
		var inputarameter = null;

		var spacePlace = inputLowerCase.indexOf(' ');
		if (spacePlace != -1) {
			inputLowerCaseCommand = inputLowerCase.substring(0, inputLowerCase.indexOf(' '));
			inputarameter = input.substring(spacePlace + 1);
		}

		if (inputLowerCaseCommand == 'ls' ||
			inputLowerCaseCommand == 'dir' ||
			inputLowerCaseCommand == 'list' ||
			inputLowerCaseCommand == 'search' ||
			inputLowerCaseCommand == 'find' ||
			inputLowerCaseCommand == 'preview' ||
			inputLowerCaseCommand == 'current' ||
			inputLowerCaseCommand == 'cursor' ||
			inputLowerCaseCommand == 'latest' ||
			inputLowerCaseCommand == 'last' ||
			inputLowerCaseCommand == 'l' ||
			inputLowerCaseCommand == 'next' ||
			inputLowerCaseCommand == 'n' ||
			inputLowerCaseCommand == 'prev' ||
			inputLowerCaseCommand == 'p' ||
			inputLowerCaseCommand == 'first' ||
			inputLowerCaseCommand == 'f' ||
			inputLowerCaseCommand == 'random' ||
			inputLowerCaseCommand == 'rand' ||
			inputLowerCaseCommand == 'r' ||
			inputLowerCaseCommand == 'categories' ||
			inputLowerCaseCommand == 'category' ||
			inputLowerCaseCommand == 'tags' ||
			inputLowerCaseCommand == 'tag' ||
			inputLowerCaseCommand == 'posteddate' ||
			inputLowerCaseCommand == 'date' ||
			Number.isInteger(parseInt(inputLowerCaseCommand))) {
			prompt.style.visibility = 'hidden';
			execute({ command: inputLowerCaseCommand, parameter: inputarameter });
			prompt.style.visibility = 'visible';
			return false;
		} else {
			display.innerHTML += "<p>Unrecognized command. Type 'help' for assistance.</p>";
			scroller();
			prompt.style.visibility = 'visible';
			return false;
		}
	}

	window.showType = function (what) {
		what = what.replace(/</g, '&lt;');
		what = what.replace(/&$/g, '&amp;');
		if (form != null) {
			form.input.value = what;
		}
		if (command != null) {
			command.innerHTML = what;
		}
	}

	window.scroller = function () {
		step = 16;
		distance = screen.scrollTop + screen.offsetHeight;
		if (screen.scrollHeight > distance) {
			if ((screen.scrollHeight - distance) > step) {
				screen.scrollTop += step;
				setTimeout('scroller();', 50);
			} else {
				screen.scrollTop = screen.scrollHeight - screen.offsetHeight;
			}
		}
	}

	window.cmdPost = function (postId) {
		doCmd("preview " + postId);
	}

	window.cmdCategory = function (categoryId) {
		doCmd("category " + categoryId);
	}

	window.cmdTag = function (tagId) {
		doCmd("tag " + tagId);
	}

	var setup = function () {
		display = document.getElementById('display');
		prompt = document.getElementById('prompt');
		command = document.getElementById('command');
		screen = document.getElementById('screen');
		form = document.forms[0];
		prompt.innerHTML = ask;
	}

	var listAPost = function (postId) {
		return '<tr><td>' + postId + '</td><td><a href="javascript:cmdPost(' + postId + ')">' + postData[postId].title + '</a></td><td>' + postData[postId].date + '</td></tr>';
	}

	var listPosts = function () {
		var result = "<table>";
		postData.forEach((post, index) => {
			result += listAPost(index);
		});
		result += "<table>";
		display.innerHTML += result;
	}

	var displayPost = function (postId) {
		var post = postData[postId];
		var categories = post.categories.split(',').map(item => item.trim());
		var tags = post.tags.split(',').map(item => item.trim());

		var result = "<div class='post'>";
		result += '<div> <a href="' + post.url + '" target="_blank"><span>' + post.title + '</span> - <span>' + post.date + '</span></a></div>';
		result += '<div>' + post.content.substr(0, 500) + '</div>';
		result += '<div>' + (categories.length > 1 ? 'Categories' : 'Category') + ': ' + categories.map(item => '<span><a href="javascript:cmdCategory(\'' + getCategoryId(item) + '\')">' + item + '</a></span> ').join(' ');
		result += '  ' + (tags.length > 1 ? 'Tags' : 'Tag') + ': ' + tags.map(item => '<span><a href="javascript:cmdTag(\'' + getTagId(item) + '\')">' + item + '</a></span> ').join(' ') + '</div>';
		result += "</div>";
		display.innerHTML += result;
	}

	var getCategoryId = function (categoryName) {
		return categoryData.findIndex(item => item.name === categoryName);
	}

	var getTagId = function (tagName) {
		return tagData.findIndex(item => item.name === tagName);
	}

	var listCategories = function () {
		var result = "<table>";
		categoryData.forEach((category, index) => {
			result += '<tr><td>' + index + '</td><td><a href="javascript:cmdCategory(' + index + ')">' + category.name + '</a></td></tr>';
		});
		result += "<table>";
		display.innerHTML += result;
	}

	var displayCategory = function (categoryId) {
		var result = "<table>";
		categoryData[categoryId].posts.forEach((item, index) => {
			result += listAPost(item);
		});
		result += "<table>";
		display.innerHTML += result;
	}

	var listTags = function () {
		var result = "<table>";
		tagData.forEach((tag, index) => {
			result += '<tr><td>' + index + '</td><td><a href="javascript:cmdTag(' + index + ')">' + tag.name + '</a></td></tr>';
		});
		result += "<table>";
		display.innerHTML += result;
	}

	var displayTag = function (tagId) {
		var result = "<table>";
		tagData[tagId].posts.forEach((item, index) => {
			result += listAPost(item);
		});
		result += "<table>";
		display.innerHTML += result;
	}

	var listPosteDdate = function () {
		var result = "<table>";
		postData.forEach((post, index) => {
			result += '<tr><td><a href="javascript:cmdPost(' + index + ')">' + post.date + '</a></td></tr>';
		});
		result += "<table>";
		display.innerHTML += result;
	}

	var parseCmdParameter = function (parameter, max) {
		if (!parameter) {
			return NaN;
		}
		var value = parseInt(parameter);
		if (!Number.isInteger(value) || value >= max || value < 0) {
			return NaN;
		}
		return value;
	}

	var execute = function (what) {
		if (!postData) {
			alert('Failure, please try later, back to home page.');
			document.location.href = "/";
			return false;
		}

		if (Number.isInteger(parseInt(what.command))) {
			var postId = parseInt(what.command);
			if (postId > postData.length || postId < 0) {
				display.innerHTML += "<p>Post not found.</p>";
			} else {
				post_id = postId;
				displayPost(post_id);
			}
		} else {
			switch (what.command) {
				case 'ls':
				case 'dir':
				case 'list':
					listPosts();
					break;
				case 'search':
				case 'find':
					if (!what.parameter) {
						display.innerHTML += "<p>Please provide search keywords.</p>";
						break;
					}
					display.innerHTML += "<p>Search results for: " + what.parameter + "</p>";
					var searchResults = [];
					var searchTerm = what.parameter.toLowerCase();
					postData.forEach((post, index) => {
						var titleMatch = post.title.toLowerCase().includes(searchTerm);
						var contentMatch = post.content.toLowerCase().includes(searchTerm);
						var categoriesMatch = post.categories.toLowerCase().includes(searchTerm);
						var tagsMatch = post.tags.toLowerCase().includes(searchTerm);
						if (titleMatch || contentMatch || categoriesMatch || tagsMatch) {
							searchResults.push(index);
						}
					});

					if (searchResults.length === 0) {
						display.innerHTML += "<p>No posts found matching '" + what.parameter + "'.</p>";
						break;
					} else {
						display.innerHTML += "<p>Found " + searchResults.length + " post(s):</p>";
						searchResults.forEach((post) => {
							displayPost(post);
							display.innerHTML += "<div class='separator'></div>";
						});
						break;
					}
				case 'preview':
					if (what.parameter) {
						var postId = parseInt(what.parameter);
						if (!Number.isInteger(postId) || postId > postData.length || postId < 0) {
							display.innerHTML += "<p>Previewing post: please give a valid post id.</p>";
							break;
						}
						else {
							post_id = postId;
						}
					}
					displayPost(post_id);
					break;
				case 'current':
				case 'cursor':
					if (what.parameter) {
						var postId = parseInt(what.parameter);
						if (!Number.isInteger(postId) || postId > postData.length || postId < 0) {
							post_id = postData.length - 1;
							display.innerHTML += "<p>Set the post id to the last when no post matches.</p>";
						}
						else {
							post_id = postId;
						}
					}
					display.innerHTML += "<p>Current post id: " + post_id + "</p>";
					break;
				case 'latest':
				case 'last':
				case 'l':
					post_id = postData.length - 1;
					displayPost(post_id);
					break;
				case 'next':
				case 'n':
					if (post_id < postData.length - 1)
						post_id++;
					displayPost(post_id);
					break;
				case 'prev':
				case 'p':
					if (post_id > 0)
						post_id--;
					displayPost(post_id);
					break;
				case 'first':
				case 'f':
					post_id = 0;
					displayPost(post_id);
					break;
				case 'random':
				case 'rand':
				case 'r':
					post_id = Math.floor(Math.random() * (postData.length - 1));
					displayPost(post_id);
					break;
				case 'categories':
					listCategories();
					break;
				case 'category':
					var categoryId = parseCmdParameter(what.parameter, categoryData.length);
					if (isNaN(categoryId)) {
						display.innerHTML += "<p>Please provide a vaild category id.</p>";
						break;
					}
					display.innerHTML += "<p>Category: " + categoryId + "</p>";
					displayCategory(categoryId);
					break;
				case 'tags':
					listTags();
					break;
				case 'tag':
					var tagId = parseCmdParameter(what.parameter, tagData.length);
					if (isNaN(tagId)) {
						display.innerHTML += "<p>Please provide a vaild tag id.</p>";
						break;
					}
					display.innerHTML += "<p>Tag: " + tagId + "</p>";
					displayTag(tagId);
					break;
				case 'posteddate':
					listPosteDdate()
					break;
				case 'date':
					const now = new Date();
					const offset = now.getTimezoneOffset();
					const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${offset <= 0 ? '+' : '-'}${String(Math.abs(Math.floor(offset / 60))).padStart(2, '0')}${String(Math.abs(offset % 60)).padStart(2, '0')}`;
					display.innerHTML += "<p>Current date: " + formatted + "</p>";
					break;
			}
		}
		scroller();
		return false;
	}

	var processPostMetadata = function (posts, fieldName) {
		var metadataMap = new Map();

		posts.forEach((post, index) => {
			if (post[fieldName]) {
				var items = post[fieldName].split(',').map(item => item.trim());
				items.forEach(item => {
					if (!metadataMap.has(item)) {
						metadataMap.set(item, []);
					}
					metadataMap.get(item).push(index);
				});
			}
		});

		var result = [];
		metadataMap.forEach((posts, name) => {
			result.push({
				name: name,
				posts: posts
			});
		});

		return result;
	};

	var fillData = function (data) {
		postData = data.reverse();
		categoryData = processPostMetadata(data, 'categories');
		tagData = processPostMetadata(data, 'tags');
	};

	var createStateChangeListener = function (xhr, callback) {
		return function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				try {
					callback(null, JSON.parse(xhr.responseText));
				} catch (err) {
					callback(err, null);
				}
			}
		}
	}

	var load = function (location, callback) {
		const xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.open('GET', location, true);
		xhr.onreadystatechange = createStateChangeListener(xhr, callback);
		xhr.send();
	};

	var init = function () {
		load(jsonDataPath, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			fillData(data);
		});
	};

	setup();
	init();
});