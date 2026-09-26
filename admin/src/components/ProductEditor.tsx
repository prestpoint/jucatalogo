import { useMemo, useState } from "react";
import { Check, ImagePlus, Images, LoaderCircle, Upload, X } from "lucide-react";
import type { Brand, Category, Product } from "../types";
import { previewAssetUrl } from "../services/catalogRepository";
import { listBucketImages, uploadProductImage, type BucketImage } from "../services/imageRepository";

const slug = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function ProductEditor({ product, brands, categories, nextOrder, onClose, onSave }: {
  product: Product | null;
  brands: Brand[];
  categories: Category[];
  nextOrder: number;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [form, setForm] = useState<Product>(() => product ?? {
    id: "", nome: "", descricao: "", marcaId: brands[0]?.id ?? "", categoriaId: categories[0]?.id ?? "",
    preco: 0, volume: "", relevancia: 2, publicado: true, disponivel: true, ordem: nextOrder,
    imagens: [{ src: "", alt: "" }],
  });
  const [bucketOpen, setBucketOpen] = useState(false);
  const [bucketImages, setBucketImages] = useState<BucketImage[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const selectedCategory = useMemo(() => categories.find((item) => item.id === form.categoriaId), [categories, form.categoriaId]);
  const update = <K extends keyof Product>(key: K, value: Product[K]) => setForm((current) => ({ ...current, [key]: value }));
  const chooseImage = (image: BucketImage) => {
    update("imagens", [{ src: image.url, alt: form.nome || image.name }]);
    setBucketOpen(false);
    setImageError("");
  };
  const openBucket = async () => {
    const nextOpen = !bucketOpen;
    setBucketOpen(nextOpen);
    if (!nextOpen || bucketImages.length) return;
    setImageLoading(true);
    setImageError("");
    try { setBucketImages(await listBucketImages()); }
    catch (reason) { setImageError(reason instanceof Error ? reason.message : "Não foi possível abrir o bucket."); }
    finally { setImageLoading(false); }
  };
  const uploadImage = async (file?: File) => {
    if (!file) return;
    if (!form.nome.trim()) {
      setImageError("Informe o nome do produto antes de enviar a imagem.");
      return;
    }
    setImageLoading(true);
    setImageError("");
    try {
      const image = await uploadProductImage(file, form.nome.trim());
      setBucketImages((current) => [image, ...current.filter((item) => item.key !== image.key)]);
      chooseImage(image);
    } catch (reason) { setImageError(reason instanceof Error ? reason.message : "Não foi possível enviar a imagem."); }
    finally { setImageLoading(false); }
  };
  const save = () => {
    const nome = form.nome.trim();
    if (!nome || !form.marcaId || !form.categoriaId || !form.imagens[0]?.src) return;
    onSave({ ...form, id: form.id || `${slug(nome)}-${Date.now().toString().slice(-5)}`, nome, imagens: [{ ...form.imagens[0], alt: form.imagens[0].alt || nome }] });
    onClose();
  };

  return <div className="editor-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="product-editor" role="dialog" aria-modal="true" aria-label={product ? "Editar produto" : "Novo produto"}>
    <header><div><span>{product ? "Edição" : "Cadastro"}</span><h2>{product ? product.nome : "Novo produto"}</h2></div><button aria-label="Fechar" onClick={onClose}><X /></button></header>
    <div className="editor-content">
      <label className="product-name-first">Nome do produto<input value={form.nome} onChange={(event) => update("nome", event.target.value)} placeholder="Ex.: Tododia Macadâmia" /></label>
      <div className="image-manager"><div className="image-preview">{form.imagens[0]?.src ? <img src={previewAssetUrl(form.imagens[0].src)} alt="Prévia do produto" /> : <ImagePlus />}</div><div className="image-actions"><strong>Imagem do produto</strong><label className="upload-image"><Upload /> Enviar nova imagem<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => { void uploadImage(event.target.files?.[0]); event.target.value = ""; }} /></label><button type="button" onClick={() => void openBucket()}><Images /> {bucketOpen ? "Fechar imagens salvas" : "Escolher do bucket"}</button><small>O arquivo recebe o nome do produto. Duplicados ganham sufixos -2, -3 e seguintes.</small></div></div>
      {imageError && <p className="image-error">{imageError}</p>}
      {imageLoading && <div className="image-loading"><LoaderCircle className="spin" /> Carregando imagens...</div>}
      {bucketOpen && !imageLoading && !imageError && <section className="bucket-picker" aria-label="Imagens salvas no bucket"><header><div><strong>Imagens salvas</strong><small>{bucketImages.length} disponíveis</small></div></header>{bucketImages.length ? <div>{bucketImages.map((image) => <button type="button" key={image.key} onClick={() => chooseImage(image)}><img src={image.url} alt={image.name} /><span>{image.name}</span></button>)}</div> : <p>Nenhuma imagem foi enviada ainda.</p>}</section>}
      <div className="form-grid">
        <label>Marca<select value={form.marcaId} onChange={(event) => update("marcaId", event.target.value)}>{brands.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
        <label>Volume<input value={form.volume} onChange={(event) => update("volume", event.target.value)} placeholder="Ex.: 400 ml" /></label>
        <label>Categoria<select value={form.categoriaId} onChange={(event) => { update("categoriaId", event.target.value); update("subcategoriaId", undefined); }}>{categories.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
        <label>Subcategoria<select value={form.subcategoriaId ?? ""} onChange={(event) => update("subcategoriaId", event.target.value || undefined)}><option value="">Sem subcategoria</option>{selectedCategory?.subcategorias.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
        <label>Preço<input type="number" min="0" step="0.01" value={form.preco} onChange={(event) => update("preco", Number(event.target.value))} /></label>
        <label>Preço anterior<input type="number" min="0" step="0.01" value={form.precoAnterior ?? ""} onChange={(event) => update("precoAnterior", event.target.value ? Number(event.target.value) : undefined)} placeholder="Opcional" /></label>
        <label className="full">Descrição<textarea rows={4} value={form.descricao} onChange={(event) => update("descricao", event.target.value)} placeholder="Descrição curta exibida nos detalhes" /></label>
      </div>
      <fieldset className="relevance-field"><legend>Relevância</legend>{([1, 2, 3] as const).map((level) => <button key={level} type="button" className={form.relevancia === level ? "selected" : ""} onClick={() => update("relevancia", level)}><i className={`level-${level}`} /><span>Nível {level}<small>{level === 1 ? "Nude" : level === 2 ? "Rosa suave" : "Rosa principal"}</small></span>{form.relevancia === level && <Check />}</button>)}</fieldset>
      <div className="switches"><label><input type="checkbox" checked={form.publicado} onChange={(event) => update("publicado", event.target.checked)} /><span><strong>Produto publicado</strong><small>Visível no catálogo</small></span></label><label><input type="checkbox" checked={form.disponivel} onChange={(event) => update("disponivel", event.target.checked)} /><span><strong>Disponível</strong><small>Pronto para venda</small></span></label></div>
    </div>
    <footer><button className="secondary" onClick={onClose}>Cancelar</button><button className="primary" onClick={save}><Check /> Salvar produto</button></footer>
  </section></div>;
}
