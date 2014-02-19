require 'rouge'

source = '
<button id="tester" class="glutton fill-horizontal">Test me!</button>

<script>
  $("#tester").on("click", function () {
    // asyncEvent is a function that returs a promise
    // ex. $.ajax() or a custom function makin use of $.Deferred

    $(this).glutton("start", asyncEvent);
  });
</script>
'

formatter = Rouge::Formatters::HTML.new(:css_class => "highlight")
lexer     = Rouge::Lexers::HTML.new

puts formatter.format(lexer.lex(source))
puts Rouge::Themes::Github.render(:scope => '.highligh')