do ($) ->
	# Namespace
	Glutton = {}

	# Variations
	Glutton.Variations =
		"default":
			onCreating: (element) ->
				# Create a wrapper for the buttons inner html
				content = $("<span />")
				# Add the buttons inner html to the wrapper
				content.html(element.html())
				# Set it's class to content
				content.addClass("content")

				# Create a wrapper for the progress bar
				progress = $("<span />")
				# Set it's class to progress
				progress.addClass("progress")

				# Clear the buttons inner html
				element.html("")

				# Append the new elemnts to the button
				element.append(content)
				element.append(progress)

			onCreated: ->

			onStart: (element) ->
				element.addClass('progressing')

			onSucceeded: (element) ->
				element.addClass('succeeded')
				# On animationend, remove succeeded class
				element.bind 'animationend webkitAnimationEnd', ->
					element.removeClass('succeeded')

				# Remove progressing class
				element.removeClass('progressing')

			onFailed: (element) ->
				element.addClass('failed')
				# On animationend, remove failed class
				element.bind 'animationend webkitAnimationEnd', ->
					element.removeClass('failed')

				# Remove progressing class
				element.removeClass('progressing')

			onProgressed: (element, progression) ->
				progressBar = element.find('.progress')

				progressBar.width((progression * 700) + "%")

			onResetting: (element) ->
				progressBar = element.find('.progress')

				progressBar.width(0)

			onReset: ->

	# Glutton
	class Glutton.Core
		constructor: (element, variation) ->
			# Store a reference to the options
			@settings = $.extend({}, Glutton.Variations["default"], Glutton.Variations[variation])

			# Store a reference to the element
			@$element = $(element)

			# Bind creating event
			@$element.on 'creating.glutton', (evt) => @settings.onCreating(@$element)

			# Bind created event
			@$element.on 'created.glutton', (evt) => @settings.onCreated(@$element)

			# Bind resetting event
			@$element.on 'resetting.glutton', (evt) => @settings.onResetting(@$element)

			# Bind reset event
			@$element.on 'reset.glutton', (evt) => @settings.onReset(@$element)

			# Bind start event
			@$element.on 'start.glutton', (evt) => @settings.onStart(@$element)

			# Bind succeeded event
			@$element.on 'succeeded.glutton', (evt, res) => @settings.onSucceeded(@$element)

			# Bind failed event
			@$element.on 'failed.glutton', (evt, res) => @settings.onFailed(@$element)

			# Bind progressed event
			@$element.on 'progressed.glutton', (evt, res) => @settings.onProgressed(@$element, res)

			# Create the necessary markup
			@create()

		create: ->
			# Trigger creating event
			@$element.trigger('creating.glutton', [@$element])

			# Do stuff here

			# Trigger created event
			@$element.trigger('created.glutton', [@$element])

		# The callback must return a promise
		start: (callback) ->
			# Trigger start event
			@$element.trigger('start.glutton')

			# Disable element to prevent further interaction
			@$element.prop('disabled', true)

			# Get promise from callback
			promise = callback()

			# Trigger succeeded event
			promise.done (res) =>
				# Enable the element
				@$element.prop('disabled', false)
				@$element.trigger("succeeded.glutton", [res])

				# Reset the element
				@reset()

			# Trigger failed event
			promise.fail (res) =>
				# Enable the element
				@$element.prop('disabled', false) 
				@$element.trigger("failed.glutton", [res])

				# Reset the element
				@reset()

			# Trigger progressed event
			promise.progress (res, total) =>
				res = res / total # Calculate the percentage done 
				@$element.trigger("progressed.glutton", [res])

		reset: ->
			# Trigger resetting event
			@$element.trigger("resetting.glutton")

			# Do something here

			# Trigger reset event
			@$element.trigger("reset.glutton")

	# Plugin definition
	$.fn.glutton = (option, callback) ->
		this.each ->
			$this = $(this)
			data  = $this.data('glutton')

			$this.data('glutton', (data = new Glutton.Core(this))) unless data
			data[option](callback) if typeof option is "string"

	$.fn.glutton.Constructor = Glutton.Core