<script>
  import { resolve } from '$app/paths';
</script>

<p>Demos</p>

<ul>
  <li><a href={resolve('/form/demos/text')}>Text Fields</a></li>
  <li>
    <a href={resolve('/form/demos/string-multiple-choice')}
      >String Multiple Choice</a
    >
  </li>
  <li><a href={resolve('/form/demos/boolean')}>Boolean Fields</a></li>
  <li><a href={resolve('/form/demos/numeric')}>Numeric Fields</a></li>
  <li>
    <a href={resolve('/form/demos/numeric-multiple-choice')}
      >Numeric Multiple Choice</a
    >
  </li>
  <li><a href={resolve('/form/demos/file')}>File Fields</a></li>
</ul>
