<script>
	import ArbeeWordImageMark from '$lib/img/2022-01_ARBEE_Wort-Bild-Marke_rgb_weiss_01.svg';
	import KoFiLogo from '$lib/img/ko-fi-icon.svg';
	import DiscordLogo from '$lib/img/icon_clyde_circle_white.svg';
	import TwitterLogo from '$lib/img/TwitterLogoWhite.svg';
	import MastodonLogo from '$lib/img/MastodonLogoWhiteCircle.svg';
	import GitHubLogo from '$lib/img/GitHub-Mark-Light-120px-plus.png';
	import MailIcon from '$lib/img/MailLogoWhite.svg';
</script>

<footer id="footer">
	<a href="https://arbeeco.de" target="_blank">
		<img src={ArbeeWordImageMark} alt="ARBEE's Word-Imagemark." />
	</a>
	<br />
	<div id="footercontact">
		<a href="https://ko-fi.com/arbee" target="_blank" rel="noreferrer">
			<img src={KoFiLogo} alt="Support me on Ko-fi!" />
		</a>
		<a href="https://discord.gg/fHu8AZBrYW" target="_blank" rel="noreferrer">
			<img src={DiscordLogo} alt="Contact ARBEE over Discord." />
		</a>
		<a href="https://twitter.com/ARBEE_codes" target="_blank" rel="noreferrer">
			<img src={TwitterLogo} alt="Contact ARBEE over Twitter" />
		</a>
		<a href="https://floss.social/@arbee" target="_blank" rel="noreferrer">
			<img src={MastodonLogo} alt="Contact ARBEE over Mastodon" />
		</a>
		<a href="https://github.com/Arbee4ever" target="_blank" rel="noreferrer">
			<img src={GitHubLogo} alt="Contact ARBEE over GitHub." />
		</a>
		<a
			href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;%61%72%62%65%65%40%61%72%62%65%65%63%6F%2E%64%65?subject=Contact-Website&body=Hello%20ARBEE%2C"
		>
			<img src={MailIcon} alt="Contact ARBEE over eMail." />
		</a>
	</div>
	<p>
		Hosted on <a href="https://pages.cloudflare.com" target="_blank" rel="noreferrer">Cloudflare</a
	>, domain from
		<a href="https://dashserv.io/a/modcollhelper" target="_blank" rel="noreferrer">dashserv</a>.
	</p>
	<p>
		Brand design by <a
		href="https://www.instagram.com/ralfbaenecke/"
		target="_blank"
		rel="noreferrer">ralf baenecke</a
	>.
	</p>
	<p>© 2022 ARBEE</p>
</footer>

<style>
	#footer {
		margin-top: 1vh;
		text-align: center;
		background-color: #000000c2;
		padding: 5vh;
	}

	#footer p {
		margin-bottom: 10px;
	}

	#footer a {
		color: #00bfff;
	}

	#footer img {
		margin-bottom: 50px;
		vertical-align: middle;
		height: 4vh;
	}

	#footercontact img {
		opacity: 0.75;
		margin-right: 5px;
		margin-left: 5px;
	}

	a,
	p {
		color: White;
		text-decoration: none;
	}
</style>
