
<script id="logo" type="text/html">
   <span class="header-logo mo-icons-logo-bg" ></span>	
   <span class="slash mo-icons-bg"></span>
   <span class="company-header-title">{{systemName}}</span>
</script>
<script id="company_info" type="text/html">
	<div class="about_company">
		<span class="mo-icons-logo-bg about_company_logo"></span><span class="mo-icons-logo-bg about_company-alternate-logo"></span>
	</div>
	<div class="about_sys"><span class="about_systemModeAbbr">/&nbsp;{{systemModeAbbr}}</span></div>
	<div class="about_corpright" >
		<p class="about_x about_companyName">{{companyName}}&nbsp;<spring:message code="home.pagebase.nav.menu.copyright"/></p>
		<p class="about_x">Copyright &copy;
		<span class="about_establishYear">{{establishYear}}</span><span class="version_year">${versionYear}</span>
		<span class="about_companyDomainName">{{companyDomainName}}</span>. All rights reserved.</p>
		<p class="about_x"><span>Version:<span class="version">${version}</span></span><a href="{{netAddress1Href}}" class="about_netAddress1 ">{{netAddress1Txt}}</a></p>
		<p class="about_x about_netAddress"><a href="{{netAddress11Href}}" class="about_netAddress11 ">{{netAddress11Txt}}</a><a href="{{netAddress2Href}}" class="about_netAddress2 ">{{netAddress2Txt}}</a></p>
	</div>
</script>