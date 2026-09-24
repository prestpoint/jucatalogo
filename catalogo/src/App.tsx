import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDownWideNarrow, ArrowRight, Bath, Check, ChevronDown, ChevronRight, Diamond, Gift, Grid2X2, Heart, Leaf, Menu, MessageCircle, Package, Search, ShieldCheck, ShoppingBag, Headphones, SlidersHorizontal, Smile, Sparkles, SprayCan, Tag, Truck, X } from 'lucide-react';
import { loadCatalog, money, normalize, type CatalogData, type Product, type ProductImage } from './data';

const icons = { perfume: SprayCan, bath: Bath, sparkles: Sparkles, smile: Smile, lipstick: Sparkles, gift: Gift, package: Package, grid: Grid2X2 };
function CategoryIcon({ name }: { name: string }) { const Icon = icons[name as keyof typeof icons] || Grid2X2; return <Icon size={19} />; }
function Photo({ image, className = '' }: { image: ProductImage; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image.src]);
  if (failed) return <div className={`photo photo-placeholder ${className}`}><ShoppingBag /><span>Foto em breve</span></div>;
  const c = image.crop;
  return <div className={`photo ${c ? 'photo-crop' : ''} ${className}`} style={c ? { aspectRatio: `${c.width}/${c.height}` } : undefined}>
    <img loading="lazy" src={image.src} alt={image.alt} onError={() => setFailed(true)} style={c ? { width: `${c.sourceWidth / c.width * 100}%`, maxWidth: 'none', left: `${-c.x / c.width * 100}%`, top: `${-c.y / c.height * 100}%` } : undefined} />
  </div>;
}

function Overlay({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    const dialog = ref.current!;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previous; last?.focus(); };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-body"><button className="icon-button close" aria-label="Fechar" onClick={onClose}><X /></button>{children}</div>
  </dialog>;
}

export default function App() {
  const [data, setData] = useState<CatalogData | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [onlyHighlights, setOnlyHighlights] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [sort, setSort] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    loadCatalog(controller.signal).then(setData).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [retry]);

  if (!data) return <main className="initial-state"><Heart size={38} /><h1>Beleza que cuida de você</h1>{error ? <><p>Não foi possível carregar o catálogo. Tente novamente em instantes.</p><button className="primary" onClick={() => setRetry(n => n + 1)}>Tentar novamente</button></> : <p role="status">Preparando um momento de beleza para você…</p>}</main>;
  const { loja, produtos } = data;
  const categories = data.categorias.filter(c => c.ativo).sort((a, b) => a.ordem - b.ordem);
  const brandList = [...data.marcas].sort((a, b) => a.ordem - b.ordem);
  const selectedCategory = categories.find(c => c.id === category);
  const selectedSub = selectedCategory?.subcategorias.find(s => s.id === subcategory);
  const activeSubs = selectedCategory?.subcategorias.filter(s => s.ativo).sort((a, b) => a.ordem - b.ordem) || [];
  const hasFilters = !!(search || category || brands.length || onlyHighlights || onlyOffers);
  const activeCount = Number(!!category) + brands.length + Number(onlyHighlights) + Number(onlyOffers);
  const visible = produtos.filter(p => {
    const brand = brandList.find(b => b.id === p.marcaId)!;
    return (!category || p.categoriaId === category) && (!subcategory || p.subcategoriaId === subcategory)
      && (!brands.length || brands.includes(p.marcaId)) && (!onlyHighlights || p.destaque)
      && (!onlyOffers || (p.precoAnterior != null && p.precoAnterior > p.preco))
      && normalize(`${p.nome} ${p.descricao} ${brand.nome}`).includes(normalize(search.trim()));
  }).sort((a, b) => sort === 'price-asc' ? a.preco - b.preco : sort === 'price-desc' ? b.preco - a.preco : sort === 'name' ? a.nome.localeCompare(b.nome, 'pt-BR') : a.ordem - b.ordem);
  const reset = () => { setSearch(''); setCategory(''); setSubcategory(''); setBrands([]); setOnlyHighlights(false); setOnlyOffers(false); };
  const chooseCategory = (id: string) => { setCategory(id); setSubcategory(''); };
  const toggleBrand = (id: string) => setBrands(current => current.includes(id) ? current.filter(b => b !== id) : [...current, id]);
  const goProducts = () => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const contact = (item?: Product) => {
    if (!loja.whatsapp) { setProduct(null); setContactOpen(true); return; }
    const text = item ? `Olá, ${loja.nome}! Gostaria de saber mais sobre ${item.nome} (${item.volume}).` : `Olá, ${loja.nome}! Gostaria de uma indicação de produtos.`;
    window.open(`https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };
  const filters = <>
    <h2 className="filter-title"><Grid2X2 size={19} /> Categorias</h2>
    <nav className="category-list" aria-label="Categorias de produtos">
      <button className={!category ? 'selected' : ''} aria-pressed={!category} onClick={() => chooseCategory('')}><ShoppingBag size={19} /><span>Todos os produtos</span></button>
      {categories.map(c => <div key={c.id}>
        <button className={category === c.id ? 'selected' : ''} aria-pressed={category === c.id} aria-expanded={c.subcategorias.some(s => s.ativo) ? category === c.id : undefined} onClick={() => chooseCategory(c.id)}><CategoryIcon name={c.icone} /><span>{c.nome}</span>{c.subcategorias.some(s => s.ativo) && <ChevronDown size={14} className={category === c.id ? 'rotated' : ''} />}</button>
        {category === c.id && activeSubs.length > 0 && <div className="subcategory-list">{activeSubs.map(s => <button key={s.id} aria-pressed={subcategory === s.id} className={subcategory === s.id ? 'active' : ''} onClick={() => setSubcategory(subcategory === s.id ? '' : s.id)}>{s.nome}</button>)}</div>}
      </div>)}
    </nav>
    <div className="filter-divider" /><h2 className="filter-title"><Tag size={19} /> Filtrar por marca</h2>
    <div className="checkbox-list">{brandList.map(b => <label key={b.id}><input type="checkbox" checked={brands.includes(b.id)} onChange={() => toggleBrand(b.id)} /><span>{b.nome}</span><small>{produtos.filter(p => p.marcaId === b.id).length}</small></label>)}</div>
    {hasFilters && <button className="clear-filters" onClick={reset}>Limpar filtros</button>}
  </>;

  return <>
    <a className="skip-link" href="#produtos">Pular para os produtos</a>
    <header className="header page-width">
      <button className="brand-lockup header-identity" onClick={reset} aria-label="Beleza que cuida de você, início">
        <span className="header-slogan"><span>Beleza</span><span>que cuida</span><span>de você!</span><Heart aria-hidden="true" /></span>
        <span className="header-tagline">Mais praticidade,<br />bem-estar e confiança<br />no seu dia a dia.</span>
      </button>
      <div className="header-center"><form role="search" className="search" onSubmit={e => { e.preventDefault(); goProducts(); }}><Search size={20} /><input ref={searchRef} aria-label="Buscar produtos" placeholder="O que você procura hoje?" value={search} onChange={e => setSearch(e.target.value)} />{search && <button type="button" className="icon-button" aria-label="Limpar busca" onClick={() => setSearch('')}><X size={16} /></button>}</form>
        <nav className="top-nav" aria-label="Navegação principal"><button className={!hasFilters ? 'active' : ''} onClick={reset}>Início</button>{brandList.map(b => <button className={brands.length === 1 && brands[0] === b.id ? 'active' : ''} key={b.id} onClick={() => { reset(); setBrands([b.id]); goProducts(); }}>{b.nome}</button>)}<button className={onlyOffers ? 'active' : ''} onClick={() => { reset(); setOnlyOffers(true); goProducts(); }}>Ofertas <span className="tiny-dot" /></button></nav>
      </div>
      <div className="header-promises"><span><Leaf />Beleza<br />de verdade</span><span><Heart />Atendimento<br />com carinho</span><span><ShoppingBag />Seu momento<br />mais especial</span></div>
    </header>

    <main className="page-width">
      <section className="hero blueprint-banner" aria-label="Beleza que cuida de você">
        <div className="banner-block banner-consultant-block">
          <div className="banner-consultant-slot" aria-hidden="true" />
          <div className="banner-benefits-row">
            <div><span className="banner-benefit-icon" aria-hidden="true"><Diamond /></span><p className="banner-field">Qualidade<br />e confiança</p></div>
            <div><span className="banner-benefit-icon" aria-hidden="true"><Heart /></span><p className="banner-field">Atendimento<br />personalizado</p></div>
            <div><span className="banner-benefit-icon" aria-hidden="true"><Truck /></span><p className="banner-field">Entrega rápida<br />e segura</p></div>
          </div>
        </div>
        <div className="banner-block banner-message-block">
          <h1 className="banner-field banner-title">Beleza<br /><span>que cuida</span><br /><span className="banner-title-ending">de você!<Heart className="banner-title-heart" aria-hidden="true" /></span></h1>
          <p className="banner-field banner-description">As melhores marcas,<br />produtos originais e<br />pronta entrega, pertinho<br />de você!</p>
        </div>
        <div className="banner-block banner-products-block">
          <img className="banner-products-image" src="/images/prod_header.png" alt="Seleção de produtos Natura, O Boticário e Eudora" />
        </div>
        <div className="banner-block banner-brands-block">
          <div className="banner-brand-message">
            <p className="banner-field banner-beauty">Beleza<br /><span>em cada</span><br /><span className="banner-beauty-ending">detalhe<Heart className="banner-beauty-heart" aria-hidden="true" /></span></p>
            <p className="banner-field banner-story"><span>Três marcas<br />que fazem<br />parte da sua<br />história!</span></p>
          </div>
          <div className="banner-brand-names">
            <div className="banner-brand-cell"><img className="banner-brand-logo" src="/images/nature.png" alt="Natura" /></div>
            <div className="banner-brand-cell"><img className="banner-brand-logo" src="/images/oboticario.png" alt="O Boticário" /></div>
            <div className="banner-brand-cell"><img className="banner-brand-logo" src="/images/eudora.png" alt="Eudora" /></div>
          </div>
        </div>
      </section>
      <div className="catalog-layout" id="produtos">
        <aside className="filters desktop-filters">{filters}</aside>
        <section className="catalog-results" aria-label="Catálogo de produtos">
          <div className="brand-tabs" aria-label="Selecionar marca"><button aria-pressed={!brands.length} className={!brands.length ? 'selected' : ''} onClick={() => setBrands([])}><Grid2X2 /><span>Todos os produtos<small>{produtos.length} produtos</small></span></button>{brandList.map(b => <button key={b.id} style={{ '--brand-color': b.cor } as CSSProperties} aria-pressed={brands.includes(b.id)} className={`brand-tab ${brands.includes(b.id) ? 'selected' : ''}`} onClick={() => setBrands(brands.length === 1 && brands[0] === b.id ? [] : [b.id])}><span className={`brand-wordmark ${b.id}`}><Photo image={{src:'/images/referencia-layout.png',alt:b.nome,crop: b.id === 'natura' ? {x:617,y:415,width:164,height:38,sourceWidth:1797} : b.id === 'boticario' ? {x:925,y:415,width:155,height:38,sourceWidth:1797} : {x:1214,y:415,width:158,height:38,sourceWidth:1797}}} /></span><small>{produtos.filter(p => p.marcaId === b.id).length} produtos</small></button>)}</div>
          <div className="results-heading"><div><h2>{selectedSub?.nome || selectedCategory?.nome || (onlyHighlights ? 'Destaques da Ju' : onlyOffers ? 'Ofertas especiais' : 'Todos os produtos')}</h2></div><span className="result-count" role="status">{visible.length} {visible.length === 1 ? 'produto' : 'produtos'}</span></div>
          <div className="toolbar"><button className="filter-mobile" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={17} /> Filtros {activeCount > 0 && <b>{activeCount}</b>}</button><label className="sort"><ArrowDownWideNarrow size={16} /><select aria-label="Ordenar produtos" value={sort} onChange={e => setSort(e.target.value)}><option value="relevance">Mais relevantes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome: A a Z</option></select></label></div>
          {activeSubs.length > 0 && <div className="sub-pills" aria-label="Subcategorias"><button className={!subcategory ? 'active' : ''} aria-pressed={!subcategory} onClick={() => setSubcategory('')}>Todos em {selectedCategory?.nome}</button>{activeSubs.map(s => <button key={s.id} className={subcategory === s.id ? 'active' : ''} aria-pressed={subcategory === s.id} onClick={() => setSubcategory(s.id)}>{s.nome}</button>)}</div>}
          {hasFilters && <div className="active-filters"><span>{search ? `Busca: “${search}”` : [selectedCategory?.nome, selectedSub?.nome, ...brandList.filter(b => brands.includes(b.id)).map(b => b.nome), onlyHighlights && 'Destaques', onlyOffers && 'Ofertas'].filter(Boolean).join(' · ')}</span><button onClick={reset}>Limpar <X size={13} /></button></div>}
          {visible.length ? <div className="product-grid">{visible.map(p => {
            const brand = brandList.find(b => b.id === p.marcaId)!;
            const discount = p.precoAnterior && p.precoAnterior > p.preco ? Math.round((1 - p.preco / p.precoAnterior) * 100) : 0;
            return <article className="product-card" key={p.id}>
              <div className="product-visual"><Photo image={p.imagens[0]} />{discount > 0 && <span className="discount">−{discount}%</span>}{p.destaque && <span className="highlight" title="Destaque escolhido pela Ju" aria-label="Destaque escolhido pela Ju"><Heart size={18} /></span>}</div>
              <div className="product-info"><span className="product-brand" style={{ color: brand.cor }}>{brand.nome}</span><h3>{p.nome}</h3><span className="product-volume">{p.descricao.split(". ")[0]} {p.volume}</span><div className="product-price"><strong>{money(p.preco)}</strong>{discount > 0 && <del>{money(p.precoAnterior!)}</del>}</div><span className={`availability ${!p.disponivel ? 'unavailable' : ''}`}><span />{p.disponivel ? 'Disponível' : 'Indisponível no momento'}</span><button className="details-button" onClick={() => setProduct(p)} aria-label={`Ver detalhes de ${p.nome}`}>Ver detalhes <ArrowRight size={15} /></button></div>
            </article>;
          })}</div> : <div className="empty"><Search size={32} /><h3>Nenhum produto por aqui ainda</h3><p>Tente outra busca ou explore os outros cuidados do catálogo.</p><button className="primary" onClick={reset}>Ver todos os produtos <ArrowRight size={16} /></button></div>}
          <div className="catalog-end"><Heart size={16} /><span>{loja.demonstracao ? 'Seleção demonstrativa • imagens e preços de referência' : 'Cada escolha, um carinho com você.'}</span></div>
        </section>
        <aside className="care-sidebar"><div className="consultant-card"><span className="round-icon"><MessageCircle size={32} /></span><h2>Fale com a consultora!</h2><p>Tire suas dúvidas, conheça as novidades e receba recomendações personalizadas.</p><button className="primary" onClick={() => contact()}>Chamar no WhatsApp <ArrowRight size={17} /></button></div>
          <div className="benefits">{[{Icon:Heart,title:'Atendimento personalizado',text:'Indicação certa para você'},{Icon:Diamond,title:'Produtos originais',text:'Qualidade e confiança das melhores marcas'},{Icon:Truck,title:'Entrega rápida',text:'O que você ama, mais rápido'},{Icon:Headphones,title:'Suporte sempre',text:'Conte comigo em cada momento'}].map(({Icon,title,text})=><div key={title}><span className="round-icon"><Icon /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
          <div className="quote-card"><Photo image={{src:'/images/referencia-layout.png',alt:'Beleza faz histórias reais',crop:{x:1474,y:999,width:304,height:160,sourceWidth:1797}}} /></div>
        </aside>
      </div>
    </main>
    <footer><Photo image={{src:'/images/referencia-layout.png',alt:'Natura, O Boticário, Eudora. Beleza que transforma o seu dia. Beleza de verdade. Atendimento com carinho. Entrega rápida. Produtos originais.',crop:{x:0,y:1171,width:1797,height:73,sourceWidth:1797}}} /></footer>
    <nav className="mobile-nav" aria-label="Atalhos"><button onClick={() => { reset(); goProducts(); }}><ShoppingBag size={20} /><span>Catálogo</span></button><button onClick={() => setFiltersOpen(true)}><Menu size={20} /><span>Categorias</span></button><button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); searchRef.current?.focus({ preventScroll: true }); }}><Search size={20} /><span>Buscar</span></button><button onClick={() => contact()}><MessageCircle size={20} /><span>Fale com a Ju</span></button></nav>
    {filtersOpen && <Overlay title="Filtros e categorias" className="filter-dialog" onClose={() => setFiltersOpen(false)}><div className="filters">{filters}</div><button className="primary apply-filters" onClick={() => { setFiltersOpen(false); goProducts(); }}>Mostrar {visible.length} produtos <Check size={17} /></button></Overlay>}
    {product && <Overlay title={product.nome} className="product-dialog" onClose={() => setProduct(null)}><div className="modal-product-photo"><Photo image={product.imagens[0]} /></div><div className="modal-product-info"><span className="eyebrow">{brandList.find(b => b.id === product.marcaId)?.nome}</span><h2>{product.nome}</h2><p className="product-volume">{product.volume}</p>{product.destaque && <span className="highlight-label"><Heart size={14} fill="currentColor" /> Destaque da Ju</span>}<p>{product.descricao}</p><strong className="modal-price">{money(product.preco)}</strong><p className="modal-stock">{product.disponivel ? 'Disponível para consultar com a Ju.' : 'Indisponível no momento. Consulte a Ju sobre reposição.'}</p><button className="primary" onClick={() => contact(product)}><MessageCircle size={18} /> Tenho interesse</button>{loja.demonstracao && <small>Produto de demonstração. Informações e preço sujeitos a ajuste.</small>}</div></Overlay>}
    {contactOpen && <Overlay title="Contato com a Ju" className="contact-dialog" onClose={() => setContactOpen(false)}><span className="round-icon"><MessageCircle /></span><h2>Logo vamos conversar!</h2><p>O contato da Ju estará disponível aqui assim que o catálogo estiver pronto.</p><button className="primary" onClick={() => setContactOpen(false)}>Continuar explorando <ChevronRight size={17} /></button></Overlay>}
  </>;
}
