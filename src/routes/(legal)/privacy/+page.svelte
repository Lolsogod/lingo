<script lang="ts">
	import {
		TERMS_PRIVACY_COMPANY,
		TERMS_PRIVACY_CONTACT_EMAIL,
		TERMS_PRIVACY_EFFECTIVE_DATE,
		TERMS_PRIVACY_WEBSITE
	} from '$lib/config/constants';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1>
			Политика конфиденциальности для {TERMS_PRIVACY_WEBSITE}
		</h1>

		<h4>
			Дата вступления в силу: {TERMS_PRIVACY_EFFECTIVE_DATE}
		</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			Настоящая политика конфиденциальности («Политика») определяет политику и практику
			конфиденциальности для {TERMS_PRIVACY_COMPANY}
			и его дочерних и аффилированных компаний (вместе «мы», «наша») в отношении сбора, использования
			и раскрытия персональной информации.
		</p>

		<h4>Собираемая информация</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы собираем и храним информацию, которую вы добровольно предоставляете нам, а также данные,
			связанные с вашим посещением и использованием веб-сайта.
		</p>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы собираем лично идентифицируемую информацию (включая, но не ограничиваясь, имя, адрес и
			номер телефона), которую вы добровольно предоставляете нам. Например, вы добровольно
			предоставляете лично идентифицируемую информацию, когда отправляете нам электронное письмо,
			используете определенные функции веб-сайта, такие как форма обратной связи, или
			регистрируетесь на нашем сайте.
		</p>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Кроме того, во время вашего посещения мы автоматически собираем определенную агрегированную
			информацию, связанную с вашим посещением веб-сайта. Агрегированная информация - это не
			идентифицируемая лично или анонимная информация о вас, включая дату и время вашего посещения,
			ваш IP-адрес, информацию о вашем компьютере и браузере, интернет-адрес, который вы посетили до
			и после посещения нашего сайта, имя домена и хоста, которые вы использовали для доступа к
			Интернету, и функции нашего сайта, к которым вы получили доступ.
		</p>
		<h4>Использование информации</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы используем эту информацию для удовлетворения потребностей наших клиентов. Мы можем
			использовать вашу информацию для удовлетворения ваших запросов на наши продукты, программы и
			услуги, для ответа на ваши запросы о наших предложениях, для предложения вам других продуктов
			или услуг, которые, по нашему мнению, могут быть вас заинтересовать, для обеспечения
			соблюдения юридических условий, регулирующих ваше использование нашего сайта, и/или для целей,
			для которых вы предоставили информацию.
		</p>
		<h4>Раскрытие информации</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			{TERMS_PRIVACY_COMPANY} не продает и не сдает в аренду вашу лично идентифицируемую информацию никому.
			Мы раскрываем лично идентифицируемую информацию о наших пользователях только в случаях, когда мы
			верим, что это требует закон, для защиты прав или собственности {TERMS_PRIVACY_COMPANY}, или
			мы должны предоставить вам услуги или продукты, которые вы запросили.
		</p>
		<h4>Cookies</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы можем использовать файлы cookie для управления сеансами наших пользователей и хранения
			предпочтений, отслеживания информации и выбора языка. Файлы cookie могут использоваться,
			независимо от того, зарегистрированы ли вы у нас или нет.
		</p>
		<h4>Безопасность</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы применяем разумные и современные методы безопасности для предотвращения
			несанкционированного доступа, поддержания точности данных и обеспечения правильного
			использования информации.
		</p>
		<h4>Возможность редактирования и удаления информации об учетной записи и настроек</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			Вы можете запросить удаление своего адреса электронной почты, отправив письмо на адрес {TERMS_PRIVACY_CONTACT_EMAIL}.
			Однако, пожалуйста, обратите внимание, что ваша идентификация, платежные и контактные данные
			будут сохранены в наших записях на некоторое время.
		</p>
		<h4>Обновления политики конфиденциальности</h4>

		<p class="max-w-[700px] text-lg text-muted-foreground">
			Мы можем время от времени обновлять эту политику. Если мы вносим существенные изменения, мы
			уведомим вас об изменениях через наш веб-сайт или другими способами, такими как электронная
			почта.
		</p>
		<h4>Как с нами связаться</h4>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Если у вас есть вопросы по поводу настоящей политики конфиденциальности, пожалуйста, свяжитесь
			с нами по адресу {TERMS_PRIVACY_CONTACT_EMAIL}.
		</p>
	</div>
</section>
