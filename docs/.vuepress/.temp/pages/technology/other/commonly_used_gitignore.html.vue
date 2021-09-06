<template><h1 id="个人常用的gitignore文件模板" tabindex="-1"><a class="header-anchor" href="#个人常用的gitignore文件模板" aria-hidden="true">#</a> 个人常用的gitignore文件模板</h1>
<blockquote>
<p>每次建项目的时候可以直接复制了,也算是方便自己,以后发现少的会更新</p>
<p>虽说github官方有一个项目 <a href="https://github.com/github/gitignore" target="_blank" rel="noopener noreferrer">github/gitignore: A collection of useful .gitignore templates<OutboundLink/></a> 但是使用过程中发现还是少了很多, 里面没有写一些比如开发工具, 系统的相关文件</p>
</blockquote>
<h2 id="作用" tabindex="-1"><a class="header-anchor" href="#作用" aria-hidden="true">#</a> 作用</h2>
<p>git提交时忽略的文件</p>
<h2 id="文件名" tabindex="-1"><a class="header-anchor" href="#文件名" aria-hidden="true">#</a> 文件名</h2>
<p><code>.gitignore</code></p>
<h2 id="python" tabindex="-1"><a class="header-anchor" href="#python" aria-hidden="true">#</a> Python</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="shiki" style="background-color: #1E1E1E"><code><span class="line"><span style="color: #6A9955"># Byte-compiled / optimized / DLL files</span></span>
<span class="line"><span style="color: #D4D4D4">__pycache__/</span></span>
<span class="line"><span style="color: #D4D4D4">*.py[cod]</span></span>
<span class="line"><span style="color: #D4D4D4">*</span><span style="color: #9CDCFE">$py</span><span style="color: #D4D4D4">.class</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># Distribution / packaging</span></span>
<span class="line"><span style="color: #D4D4D4">.Python</span></span>
<span class="line"><span style="color: #D4D4D4">env/</span></span>
<span class="line"><span style="color: #D4D4D4">build/</span></span>
<span class="line"><span style="color: #D4D4D4">dist/</span></span>
<span class="line"><span style="color: #D4D4D4">*.log</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># pyenv</span></span>
<span class="line"><span style="color: #D4D4D4">.python-version</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># dotenv</span></span>
<span class="line"><span style="color: #D4D4D4">.env</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># virtualenv</span></span>
<span class="line"><span style="color: #D4D4D4">.venv/</span></span>
<span class="line"><span style="color: #D4D4D4">venv/</span></span>
<span class="line"><span style="color: #D4D4D4">ENV/</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># VSCode settings</span></span>
<span class="line"><span style="color: #D4D4D4">.vscode</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># IDEA files</span></span>
<span class="line"><span style="color: #D4D4D4">.idea</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># OSX dir files</span></span>
<span class="line"><span style="color: #D4D4D4">.DS_Store</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># Sublime Text settings</span></span>
<span class="line"><span style="color: #D4D4D4">*.sublime-workspace</span></span>
<span class="line"><span style="color: #D4D4D4">*.sublime-project</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><h2 id="go" tabindex="-1"><a class="header-anchor" href="#go" aria-hidden="true">#</a> Go</h2>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="shiki" style="background-color: #1E1E1E"><code><span class="line"><span style="color: #6A9955"># Build</span></span>
<span class="line"><span style="color: #D4D4D4">bulid/</span></span>
<span class="line"><span style="color: #D4D4D4">*.exe</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># dotenv</span></span>
<span class="line"><span style="color: #D4D4D4">.env</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># venv</span></span>
<span class="line"><span style="color: #D4D4D4">/vendor/</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># Log</span></span>
<span class="line"><span style="color: #D4D4D4">*.log</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># VSCode settings</span></span>
<span class="line"><span style="color: #D4D4D4">.vscode</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># IDEA files</span></span>
<span class="line"><span style="color: #D4D4D4">.idea</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># OSX dir files</span></span>
<span class="line"><span style="color: #D4D4D4">.DS_Store</span></span>
<span class="line"></span>
<span class="line"><span style="color: #6A9955"># Sublime Text settings</span></span>
<span class="line"><span style="color: #D4D4D4">*.sublime-workspace</span></span>
<span class="line"><span style="color: #D4D4D4">*.sublime-project</span></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div></template>
