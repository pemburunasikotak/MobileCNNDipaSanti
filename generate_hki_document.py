import os
import sys
from PIL import Image, ImageDraw, ImageFont

# Import python-docx
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# Import reportlab
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table as RLTable,
    TableStyle, PageBreak, HRFlowable, Preformatted, KeepTogether
)
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "hki_assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

# Data Metadata HKI
NAMA_APLIKASI = "Fish Qual"
JENIS_CIPTAAN = "Program Komputer"
JUDUL_CIPTAAN = "Fish Qual - Program Komputer Klasifikasi dan Analisis Kesegaran Jenis Ikan Berbasis Convolutional Neural Network (CNN MobileNetV2)"

PEMEGANG_HAK_CIPTA = [
    "Santi Febrianti, S.Pi., M.Si",
    "Aisyah Nur Nabila, S.Pi., M.Si",
    "Rudy Suryadi, S.T., M.T",
    "Riyan Bagus Prihandanu, S.T., M.T",
    "Ratih Berliana, S.KM., M.KKK",
    "Nuke Amalia, S.KM., S.Kes",
    "Teguh Junian Kuswanto, S.Kom., M.Kom."
]

INSTITUSI = "POLITEKNIK PERKAPALAN NEGERI SURABAYA"

# Output File Paths
DOCX_OUTPUT_PATH = os.path.join(BASE_DIR, "Dokumen_Hak_Cipta_Program_Komputer.docx")
PDF_OUTPUT_PATH = os.path.join(BASE_DIR, "Dokumen_Hak_Cipta_Program_Komputer.pdf")

# Source Code files to include in HKI attachment
CODE_FILES = [
    {"name": "App.tsx", "path": os.path.join(BASE_DIR, "App.tsx"), "desc": "Komponen Utama Navigasi & Management State Aplikasi Mobile Fish Qual"},
    {"name": "SplashScreen.tsx", "path": os.path.join(BASE_DIR, "src", "screens", "SplashScreen.tsx"), "desc": "Tampilan Splash Screen & Animasi Initializer AI Fish Qual"},
    {"name": "HomeScreen.tsx", "path": os.path.join(BASE_DIR, "src", "screens", "HomeScreen.tsx"), "desc": "Tampilan Beranda, Edukasi Gizi Kembung vs Salmon, & Pencarian Ikan"},
    {"name": "ScanScreen.tsx", "path": os.path.join(BASE_DIR, "src", "screens", "ScanScreen.tsx"), "desc": "Modul Kamera & Pemindaian Gambar/Model Prediksi Kesegaran CNN"},
    {"name": "DetailScreen.tsx", "path": os.path.join(BASE_DIR, "src", "screens", "DetailScreen.tsx"), "desc": "Tampilan Rincian Hasil Prediksi AI & Tabel Kandungan Nutrisi Ikan"},
    {"name": "fishData.ts", "path": os.path.join(BASE_DIR, "src", "data", "fishData.ts"), "desc": "Database Lokal Kandungan Gizi & Profil Ikan Laut Indonesia"},
    {"name": "index.js", "path": os.path.join(BASE_DIR, "index.js"), "desc": "Entry Point Pendaftaran Komponen Utama React Native AppRegistry"},
    {"name": "package.json", "path": os.path.join(BASE_DIR, "package.json"), "desc": "Konfigurasi Dependensi & Manifest Proyek React Native"}
]

def generate_mockup_images():
    """Membuat 4 gambar mockup visual aplikasi Fish Qual yang sangat realistis untuk dokumen HKI."""
    # 1. Main Cover Image (UI Card Fish Qual AI)
    img1 = Image.new("RGB", (700, 500), color="#0b0f19")
    draw1 = ImageDraw.Draw(img1)
    
    # Outer frame
    draw1.rectangle([20, 20, 680, 480], outline="#06b6d4", width=3)
    draw1.rectangle([30, 30, 670, 470], fill="#1e293b")
    
    # Header area
    draw1.rectangle([30, 30, 670, 100], fill="#0f172a")
    draw1.text((50, 45), "Fish Qual - Smart Fish Detection & Nutrition AI", fill="#38bdf8", font_size=22)
    draw1.text((50, 75), "Klasifikasi Kesegaran Ikan Berbasis CNN MobileNetV2", fill="#94a3b8", font_size=14)
    
    # Content left (Fish graphic simulation)
    draw1.rectangle([60, 130, 340, 380], fill="#0f172a", outline="#38bdf8", width=2)
    draw1.ellipse([110, 180, 290, 330], fill="#0284c7")
    draw1.ellipse([240, 220, 260, 240], fill="#ffffff") # Eye
    draw1.polygon([(110, 255), (70, 210), (70, 300)], fill="#0284c7") # Tail
    draw1.rectangle([80, 145, 320, 175], fill="#0369a1", outline="#06b6d4")
    draw1.text((90, 150), "[AI Bounding Box: 98.8%]", fill="#4ade80", font_size=14)
    
    # Content right (Metrics & Nutrients)
    draw1.rectangle([370, 130, 640, 240], fill="#0f172a", outline="#475569")
    draw1.text((385, 145), "Hasil Prediksi Fish Qual:", fill="#94a3b8", font_size=13)
    draw1.text((385, 168), "Ikan Kembung (Segar)", fill="#4ade80", font_size=20)
    draw1.text((385, 205), "Status: Layak Konsumsi Tinggi", fill="#e2e8f0", font_size=13)
    
    draw1.rectangle([370, 260, 640, 440], fill="#0f172a", outline="#475569")
    draw1.text((385, 275), "Kandungan Nutrisi Utama:", fill="#38bdf8", font_size=14)
    draw1.text((385, 305), "• Protein      : 19.4 g (Tinggi)", fill="#f8fafc", font_size=13)
    draw1.text((385, 335), "• Omega-3     : 2.6 g (Setara Salmon)", fill="#f8fafc", font_size=13)
    draw1.text((385, 365), "• Kalori       : 112 kcal", fill="#f8fafc", font_size=13)
    draw1.text((385, 395), "• Zat Besi     : 1.9 mg", fill="#f8fafc", font_size=13)
    
    path1 = os.path.join(ASSETS_DIR, "cover_app_image.png")
    img1.save(path1)

    # 2. Mockup Screen 1: Splash & Home Screen
    img2 = Image.new("RGB", (700, 450), color="#0f172a")
    draw2 = ImageDraw.Draw(img2)
    
    # Left phone frame (Splash)
    draw2.rectangle([40, 30, 320, 420], fill="#0b0f19", outline="#38bdf8", width=2)
    draw2.ellipse([140, 100, 220, 180], outline="#06b6d4", width=3)
    draw2.text((120, 200), "Fish Qual AI", fill="#ffffff", font_size=20)
    draw2.text((80, 235), "Smart Fish Detection & Nutrition", fill="#94a3b8", font_size=12)
    draw2.text((115, 360), "[Memuat Model...]", fill="#06b6d4", font_size=12)
    draw2.text((120, 40), "Tampilan Splash Screen", fill="#64748b", font_size=11)
    
    # Right phone frame (Home)
    draw2.rectangle([380, 30, 660, 420], fill="#0b0f19", outline="#38bdf8", width=2)
    draw2.text((395, 45), "Halo, Pecinta Ikan Sehat 👋", fill="#ffffff", font_size=14)
    draw2.rectangle([395, 80, 645, 160], fill="#0369a1")
    draw2.text((410, 95), "Kembung vs Salmon", fill="#ffffff", font_size=16)
    draw2.text((410, 125), "Omega-3 Kembung setara Salmon!", fill="#e0f2fe", font_size=11)
    draw2.rectangle([395, 175, 645, 210], fill="#1e293b")
    draw2.text((410, 188), "🔍 Cari kandungan gizi ikan...", fill="#64748b", font_size=12)
    draw2.rectangle([395, 225, 645, 290], fill="#1e293b")
    draw2.text((410, 240), "🐟 Ikan Kembung (Rekomendasi)", fill="#38bdf8", font_size=13)
    draw2.text((410, 265), "112 kcal | Protein 19.4g", fill="#94a3b8", font_size=11)
    draw2.rectangle([395, 305, 645, 370], fill="#1e293b")
    draw2.text((410, 320), "🐟 Ikan Tongkol (Populer)", fill="#38bdf8", font_size=13)
    draw2.text((410, 345), "150 kcal | Protein 25.0g", fill="#94a3b8", font_size=11)

    path2 = os.path.join(ASSETS_DIR, "screen_splash_home.png")
    img2.save(path2)

    # 3. Mockup Screen 2: Scan Screen (AI Real-time Inference)
    img3 = Image.new("RGB", (700, 450), color="#0f172a")
    draw3 = ImageDraw.Draw(img3)
    draw3.rectangle([40, 30, 660, 420], fill="#0b0f19", outline="#06b6d4", width=3)
    draw3.text((60, 50), "📷 Fish Qual - Pemindaian Kamera & Analisis AI Kesegaran Ikan", fill="#38bdf8", font_size=17)
    
    # Viewfinder area
    draw3.rectangle([80, 90, 450, 380], fill="#1e293b", outline="#06b6d4", width=2)
    draw3.ellipse([180, 170, 350, 300], fill="#0284c7")
    draw3.rectangle([130, 130, 400, 340], outline="#4ade80", width=3)
    draw3.text((140, 140), "DETEKSI CNN: KEMBUNG SEGAR (98.8%)", fill="#4ade80", font_size=12)
    
    # Control panel right
    draw3.rectangle([470, 90, 640, 180], fill="#1e293b")
    draw3.text((480, 105), "Mode API:", fill="#94a3b8", font_size=12)
    draw3.text((480, 125), "[X] Flask Real Server", fill="#38bdf8", font_size=12)
    draw3.text((480, 145), "IP: 192.168.34.102", fill="#e2e8f0", font_size=11)
    
    draw3.rectangle([470, 200, 640, 280], fill="#0284c7")
    draw3.text((495, 235), "📸 Ambil Foto", fill="#ffffff", font_size=15)
    
    draw3.rectangle([470, 300, 640, 380], fill="#0d9488")
    draw3.text((490, 335), "🖼️ Dari Galeri", fill="#ffffff", font_size=15)
    
    path3 = os.path.join(ASSETS_DIR, "screen_scan_ai.png")
    img3.save(path3)

    # 4. Mockup Screen 3: Detail Screen (Nutrition & Recommendation)
    img4 = Image.new("RGB", (700, 450), color="#0f172a")
    draw4 = ImageDraw.Draw(img4)
    draw4.rectangle([40, 30, 660, 420], fill="#0b0f19", outline="#06b6d4", width=2)
    
    draw4.text((60, 45), "Fish Qual - Rincian Hasil Prediksi & Gizi Ikan", fill="#38bdf8", font_size=18)
    
    # Status Banner
    draw4.rectangle([60, 80, 640, 140], fill="#166534")
    draw4.text((80, 95), "✓ Ikan Kembung - SEGAR", fill="#ffffff", font_size=18)
    draw4.text((80, 120), "Tingkat Kesegaran: 98.8% | Sangat Baik & Layak Dikonsumsi", fill="#bbf7d0", font_size=12)
    
    # Table Nutrisi
    draw4.rectangle([60, 155, 340, 390], fill="#1e293b")
    draw4.text((75, 170), "Tabel Nutrisi Utama (per 100g):", fill="#38bdf8", font_size=14)
    draw4.text((75, 200), "• Energi Total   : 112 kcal", fill="#f8fafc", font_size=12)
    draw4.text((75, 230), "• Protein        : 19.4 gram", fill="#f8fafc", font_size=12)
    draw4.text((75, 260), "• Lemak Total    : 2.3 gram", fill="#f8fafc", font_size=12)
    draw4.text((75, 290), "• Kolesterol     : 33 mg", fill="#f8fafc", font_size=12)
    draw4.text((75, 320), "• Omega-3        : 2.6 gram", fill="#4ade80", font_size=12)
    draw4.text((75, 350), "• Kalsium        : 136 mg", fill="#f8fafc", font_size=12)

    # Manfaat & Rekomendasi Olahan
    draw4.rectangle([360, 155, 640, 390], fill="#1e293b")
    draw4.text((375, 170), "Manfaat Kesehatan & Olahan:", fill="#38bdf8", font_size=14)
    draw4.text((375, 200), "1. Menjaga kesehatan jantung & otak", fill="#cbd5e1", font_size=12)
    draw4.text((375, 225), "2. Mencegah stunting pada anak", fill="#cbd5e1", font_size=12)
    draw4.text((375, 250), "3. Sumber protein tinggi terjangkau", fill="#cbd5e1", font_size=12)
    draw4.text((375, 290), "Saran Pengolahan:", fill="#e2e8f0", font_size=13)
    draw4.text((375, 315), "• Kukus / Pindang Bumbu Kuning", fill="#94a3b8", font_size=12)
    draw4.text((375, 340), "• Panggang dengan rempah alami", fill="#94a3b8", font_size=12)

    path4 = os.path.join(ASSETS_DIR, "screen_detail_nutrition.png")
    img4.save(path4)

    return path1, path2, path3, path4


def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Mengatur padding sel tabel Word."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    """Mengatur garis tepi sel tabel Word."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = 'w:{}'.format(edge)
            element = OxmlElement(tag)
            element.set(qn('w:val'), edge_data.get('val', 'single'))
            element.set(qn('w:sz'), str(edge_data.get('sz', 4)))
            element.set(qn('w:space'), '0')
            element.set(qn('w:color'), edge_data.get('color', 'auto'))
            tcBorders.append(element)
    tcPr.append(tcBorders)

def set_cell_shading(cell, color_hex):
    """Mengatur latar belakang warna sel tabel Word."""
    shading_xml = f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))


# ==============================================================================
# GENERATOR DOKUMEN WORD (.DOCX)
# ==============================================================================
def create_word_document(img1_path, img2_path, img3_path, img4_path):
    print("Membuat dokumen Word (.docx)...")
    doc = Document()
    
    # Set Margins (Normal: 1 inch = 1440 dxa)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
    # Standard styles font
    style_normal = doc.styles['Normal']
    font_normal = style_normal.font
    font_normal.name = 'Arial'
    font_normal.size = Pt(11)
    font_normal.color.rgb = RGBColor(0x00, 0x00, 0x00)

    def add_hki_cover_table():
        table = doc.add_table(rows=2, cols=3)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        
        widths = [Inches(1.5), Inches(0.3), Inches(4.7)]
        
        headers = ["Jenis Ciptaan", "Judul"]
        contents = [JENIS_CIPTAAN, JUDUL_CIPTAAN]
        
        border_kwargs = {
            'top': {'val': 'single', 'sz': 4, 'color': '000000'},
            'bottom': {'val': 'single', 'sz': 4, 'color': '000000'},
            'left': {'val': 'single', 'sz': 4, 'color': '000000'},
            'right': {'val': 'single', 'sz': 4, 'color': '000000'},
        }
        
        for i in range(2):
            row = table.rows[i]
            
            # Col 0: Header
            c0 = row.cells[0]
            c0.width = widths[0]
            p0 = c0.paragraphs[0]
            r0 = p0.add_run(headers[i])
            r0.bold = True
            r0.font.size = Pt(11)
            p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
            set_cell_margins(c0, top=120, bottom=120, left=150, right=150)
            set_cell_border(c0, **border_kwargs)
            
            # Col 1: Colon
            c1 = row.cells[1]
            c1.width = widths[1]
            p1 = c1.paragraphs[0]
            r1 = p1.add_run(":")
            r1.bold = True
            p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
            set_cell_margins(c1, top=120, bottom=120, left=50, right=50)
            set_cell_border(c1, **border_kwargs)
            
            # Col 2: Value
            c2 = row.cells[2]
            c2.width = widths[2]
            p2 = c2.paragraphs[0]
            r2 = p2.add_run(contents[i])
            r2.font.size = Pt(11)
            if i == 1:
                r2.bold = True
            p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
            set_cell_margins(c2, top=120, bottom=120, left=150, right=150)
            set_cell_border(c2, **border_kwargs)

    # --------------------------------------------------------------------------
    # PAGE 1: COVER HALAMAN UTAMA HKI
    # --------------------------------------------------------------------------
    add_hki_cover_table()
    doc.add_paragraph().paragraph_format.space_before = Pt(12)
    
    # Image utama
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_img = p_img.add_run()
    run_img.add_picture(img1_path, width=Inches(4.5))
    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(18)
    
    # Pemegang Hak Cipta
    p_holder = doc.add_paragraph()
    p_holder.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_holder.paragraph_format.space_after = Pt(12)
    r_h = p_holder.add_run("Pemegang Hak Cipta :")
    r_h.font.size = Pt(12)
    
    for member in PEMEGANG_HAK_CIPTA:
        p_m = doc.add_paragraph()
        p_m.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_m.paragraph_format.space_before = Pt(2)
        p_m.paragraph_format.space_after = Pt(2)
        r_m = p_m.add_run(member)
        r_m.bold = True
        r_m.font.size = Pt(11)
        
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(14)
    r_inst = p_inst.add_run(INSTITUSI)
    r_inst.bold = True
    r_inst.font.size = Pt(12)
    
    doc.add_page_break()

    # --------------------------------------------------------------------------
    # PAGES 2-3: PANDUAN PENGGUNAAN PROGRAM KOMPUTER
    # --------------------------------------------------------------------------
    p_p1 = doc.add_paragraph()
    p_p1.paragraph_format.space_after = Pt(6)
    r_p1 = p_p1.add_run("Panduan program Fish Qual: Klasifikasi dan analisis kesegaran jenis ikan.")
    r_p1.font.size = Pt(11)

    p_p2 = doc.add_paragraph()
    p_p2.paragraph_format.space_after = Pt(12)
    r_p2 = p_p2.add_run(
        "Program komputer Fish Qual ini menjalankan perintah agar pengguna aplikasi mobile dapat melakukan klasifikasi "
        "jenis ikan (segar / tidak segar) berbasis Convolutional Neural Network (CNN MobileNetV2), "
        "serta menampilkan analisis lengkap kandungan gizi ikan (Protein, Kalori, Omega-3, Lemak, Kalsium) secara otomatis."
    )
    r_p2.font.size = Pt(11)

    # Point 1
    p_num1 = doc.add_paragraph()
    p_num1.paragraph_format.space_before = Pt(10)
    p_num1.paragraph_format.space_after = Pt(6)
    r_num1 = p_num1.add_run("1. Tampilan saat aplikasi Fish Qual AI dijalankan (Splash Screen & Beranda Utama):")
    r_num1.font.size = Pt(11)
    
    p_i2 = doc.add_paragraph()
    p_i2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_i2.add_run().add_picture(img2_path, width=Inches(5.0))
    p_i2.paragraph_format.space_after = Pt(12)

    # Point 2
    p_num2 = doc.add_paragraph()
    p_num2.paragraph_format.space_before = Pt(10)
    p_num2.paragraph_format.space_after = Pt(6)
    r_num2 = p_num2.add_run("2. Video lengkap demo running program aplikasi mobile Fish Qual bisa diakses melalui tautan berikut:")
    r_num2.font.size = Pt(11)
    
    p_link = doc.add_paragraph()
    p_link.paragraph_format.left_indent = Inches(0.3)
    p_link.paragraph_format.space_after = Pt(12)
    r_link = p_link.add_run("https://github.com/pemburunasikotak/MobileCNNDipaSanti")
    r_link.font.color.rgb = RGBColor(0x00, 0x00, 0xEE)
    r_link.underline = True

    # Point 3
    p_num3 = doc.add_paragraph()
    p_num3.paragraph_format.space_before = Pt(10)
    p_num3.paragraph_format.space_after = Pt(6)
    r_num3 = p_num3.add_run(
        "3. Program pemindaian kamera dan inferensi AI real-time Fish Qual untuk klasifikasi jenis dan kesegaran ikan "
        "adalah sebagai berikut:"
    )
    r_num3.font.size = Pt(11)

    p_i3 = doc.add_paragraph()
    p_i3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_i3.add_run().add_picture(img3_path, width=Inches(5.0))
    p_i3.paragraph_format.space_after = Pt(12)

    # Point 4
    p_num4 = doc.add_paragraph()
    p_num4.paragraph_format.space_before = Pt(10)
    p_num4.paragraph_format.space_after = Pt(6)
    r_num4 = p_num4.add_run("4. Tampilan rincian hasil analisis kesegaran dan rekomendasi kandungan gizi ikan pada aplikasi Fish Qual:")
    r_num4.font.size = Pt(11)

    p_i4 = doc.add_paragraph()
    p_i4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_i4.add_run().add_picture(img4_path, width=Inches(5.0))
    p_i4.paragraph_format.space_after = Pt(12)

    # Point 5
    p_num5 = doc.add_paragraph()
    p_num5.paragraph_format.space_before = Pt(10)
    p_num5.paragraph_format.space_after = Pt(6)
    r_num5 = p_num5.add_run("5. Tangkapan layar dan arsitektur visual sistem aplikasi Fish Qual secara lengkap adalah sebagai berikut:")
    r_num5.font.size = Pt(11)

    p_i5 = doc.add_paragraph()
    p_i5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_i5.add_run().add_picture(img1_path, width=Inches(5.0))
    p_i5.paragraph_format.space_after = Pt(12)

    doc.add_page_break()

    # --------------------------------------------------------------------------
    # PAGE 4: HALAMAN SAMPUL KODE PROGRAM (HAK CIPTA COVER FOR SOURCE CODE)
    # --------------------------------------------------------------------------
    add_hki_cover_table()
    doc.add_paragraph().paragraph_format.space_before = Pt(60)

    p_holder2 = doc.add_paragraph()
    p_holder2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_holder2.paragraph_format.space_after = Pt(16)
    r_h2 = p_holder2.add_run("Pemegang Hak Cipta :")
    r_h2.font.size = Pt(12)

    for member in PEMEGANG_HAK_CIPTA:
        p_m = doc.add_paragraph()
        p_m.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_m.paragraph_format.space_before = Pt(3)
        p_m.paragraph_format.space_after = Pt(3)
        r_m = p_m.add_run(member)
        r_m.bold = True
        r_m.font.size = Pt(11)

    p_inst2 = doc.add_paragraph()
    p_inst2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst2.paragraph_format.space_before = Pt(20)
    r_inst2 = p_inst2.add_run(INSTITUSI)
    r_inst2.bold = True
    r_inst2.font.size = Pt(12)

    doc.add_page_break()

    # --------------------------------------------------------------------------
    # PAGES 5+: LAMPIRAN KODE PROGRAM KOMPUTER
    # --------------------------------------------------------------------------
    p_h_code = doc.add_paragraph()
    p_h_code.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_h_code.paragraph_format.space_after = Pt(18)
    r_hc = p_h_code.add_run("LAMPIRAN KODE PROGRAM KOMPUTER")
    r_hc.bold = True
    r_hc.font.size = Pt(14)

    for code_info in CODE_FILES:
        f_name = code_info["name"]
        f_path = code_info["path"]
        f_desc = code_info["desc"]
        
        if not os.path.exists(f_path):
            continue
            
        with open(f_path, "r", encoding="utf-8", errors="ignore") as f:
            code_text = f.read()

        p_fn = doc.add_paragraph()
        p_fn.paragraph_format.space_before = Pt(14)
        p_fn.paragraph_format.space_after = Pt(4)
        r_fn = p_fn.add_run(f"// File: {f_name}")
        r_fn.bold = True
        r_fn.font.size = Pt(11)
        r_fn.font.color.rgb = RGBColor(0x02, 0x84, 0xc7)
        
        p_fd = doc.add_paragraph()
        p_fd.paragraph_format.space_after = Pt(6)
        r_fd = p_fd.add_run(f"// Deskripsi: {f_desc}")
        r_fd.italic = True
        r_fd.font.size = Pt(9.5)
        r_fd.font.color.rgb = RGBColor(0x64, 0x74, 0x8b)

        # Code Block Table Container
        c_table = doc.add_table(rows=1, cols=1)
        c_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        c_table.autofit = False
        
        cell = c_table.rows[0].cells[0]
        cell.width = Inches(6.5)
        set_cell_shading(cell, "F8FAFC")
        set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
        set_cell_border(cell, **{
            'top': {'val': 'single', 'sz': 4, 'color': 'CBD5E1'},
            'bottom': {'val': 'single', 'sz': 4, 'color': 'CBD5E1'},
            'left': {'val': 'single', 'sz': 4, 'color': 'CBD5E1'},
            'right': {'val': 'single', 'sz': 4, 'color': 'CBD5E1'},
        })
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(2)
        cp.paragraph_format.space_after = Pt(2)
        cp.paragraph_format.line_spacing = 1.15
        
        # Split text by lines to preserve code formatting
        lines = code_text.splitlines()
        for idx, line in enumerate(lines):
            r_c = cp.add_run(line + ("\n" if idx < len(lines) - 1 else ""))
            r_c.font.name = 'Courier New'
            r_c.font.size = Pt(8.5)
            r_c.font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)

        doc.add_paragraph().paragraph_format.space_after = Pt(12)

    doc.save(DOCX_OUTPUT_PATH)
    print(f"Dokumen Word berhasil dibuat: {DOCX_OUTPUT_PATH}")


# ==============================================================================
# GENERATOR DOKUMEN PDF (.PDF via ReportLab)
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
    """Canvas custom ReportLab untuk menambahkan nomor halaman otomatis."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        # Do not print page number on cover pages (page 1 and page 4)
        if self._pageNumber in [1, 4]:
            return
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        page_text = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(A4[0] - 0.75 * inch, 0.5 * inch, page_text)
        self.drawString(0.75 * inch, 0.5 * inch, "Dokumen Hak Cipta (HKI) - Program Komputer Fish Qual")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(0.75 * inch, 0.65 * inch, A4[0] - 0.75 * inch, 0.65 * inch)


def create_pdf_document(img1_path, img2_path, img3_path, img4_path):
    print("Membuat dokumen PDF...")
    pdf_doc = SimpleDocTemplate(
        PDF_OUTPUT_PATH,
        pagesize=A4,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.85 * inch
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    style_normal = ParagraphStyle(
        'NormalIndonesian',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor('#1e293b')
    )
    
    style_bold_center = ParagraphStyle(
        'BoldCenter',
        parent=style_normal,
        fontName='Helvetica-Bold',
        alignment=1,
        fontSize=11,
        leading=16
    )

    style_title_code = ParagraphStyle(
        'TitleCode',
        parent=style_normal,
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=18,
        alignment=1,
        textColor=colors.HexColor('#0f172a')
    )

    style_code = ParagraphStyle(
        'CodeStyle',
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    def make_hki_pdf_table():
        t_data = [
            [
                Paragraph("<b>Jenis Ciptaan</b>", style_normal),
                Paragraph("<b>:</b>", style_bold_center),
                Paragraph(JENIS_CIPTAAN, style_normal)
            ],
            [
                Paragraph("<b>Judul</b>", style_normal),
                Paragraph("<b>:</b>", style_bold_center),
                Paragraph(f"<b>{JUDUL_CIPTAAN}</b>", style_normal)
            ]
        ]
        t = RLTable(t_data, colWidths=[1.4 * inch, 0.25 * inch, 5.05 * inch])
        t.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor('#000000')),
            ('INNERGRID', (0,0), (-1,-1), 0.75, colors.HexColor('#000000')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    # --------------------------------------------------------------------------
    # PAGE 1: PDF COVER HAK CIPTA
    # --------------------------------------------------------------------------
    story.append(make_hki_pdf_table())
    story.append(Spacer(1, 15))
    story.append(RLImage(img1_path, width=4.5 * inch, height=3.21 * inch))
    story.append(Spacer(1, 15))
    story.append(Paragraph("Pemegang Hak Cipta :", ParagraphStyle('H1', parent=style_normal, alignment=1, fontSize=11)))
    story.append(Spacer(1, 8))
    
    for member in PEMEGANG_HAK_CIPTA:
        story.append(Paragraph(member, style_bold_center))
        story.append(Spacer(1, 2))
        
    story.append(Spacer(1, 10))
    story.append(Paragraph(INSTITUSI, ParagraphStyle('Inst', parent=style_bold_center, fontSize=12)))
    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGES 2-3: PANDUAN PENGGUNAAN PROGRAM KOMPUTER
    # --------------------------------------------------------------------------
    story.append(Paragraph("Panduan program Fish Qual: Klasifikasi dan analisis kesegaran jenis ikan.", style_normal))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Program komputer Fish Qual ini menjalankan perintah agar pengguna aplikasi mobile dapat melakukan klasifikasi "
        "jenis ikan (segar / tidak segar) berbasis Convolutional Neural Network (CNN MobileNetV2), "
        "serta menampilkan analisis lengkap kandungan gizi ikan (Protein, Kalori, Omega-3, Lemak, Kalsium) secara otomatis.",
        style_normal
    ))
    story.append(Spacer(1, 10))

    # Point 1
    story.append(Paragraph("1. Tampilan saat aplikasi Fish Qual AI dijalankan (Splash Screen & Beranda Utama):", style_normal))
    story.append(Spacer(1, 6))
    story.append(RLImage(img2_path, width=5.0 * inch, height=3.21 * inch))
    story.append(Spacer(1, 10))

    # Point 2
    story.append(Paragraph("2. Video lengkap demo running program aplikasi mobile Fish Qual bisa diakses melalui tautan berikut:", style_normal))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<font color='#0000EE'><u>https://github.com/pemburunasikotak/MobileCNNDipaSanti</u></font>", style_normal))
    story.append(Spacer(1, 10))

    # Point 3
    story.append(Paragraph(
        "3. Program pemindaian kamera dan inferensi AI real-time Fish Qual untuk klasifikasi jenis dan kesegaran ikan "
        "adalah sebagai berikut:",
        style_normal
    ))
    story.append(Spacer(1, 6))
    story.append(RLImage(img3_path, width=5.0 * inch, height=3.21 * inch))
    story.append(Spacer(1, 10))

    # Point 4
    story.append(Paragraph("4. Tampilan rincian hasil analisis kesegaran dan rekomendasi kandungan gizi ikan pada aplikasi Fish Qual:", style_normal))
    story.append(Spacer(1, 6))
    story.append(RLImage(img4_path, width=5.0 * inch, height=3.21 * inch))
    story.append(Spacer(1, 10))

    # Point 5
    story.append(Paragraph("5. Tangkapan layar dan arsitektur visual sistem aplikasi Fish Qual secara lengkap adalah sebagai berikut:", style_normal))
    story.append(Spacer(1, 6))
    story.append(RLImage(img1_path, width=5.0 * inch, height=3.57 * inch))
    story.append(Spacer(1, 10))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 4: PDF COVER CODE ATTACHMENT
    # --------------------------------------------------------------------------
    story.append(make_hki_pdf_table())
    story.append(Spacer(1, 60))
    story.append(Paragraph("Pemegang Hak Cipta :", ParagraphStyle('H2', parent=style_normal, alignment=1, fontSize=11)))
    story.append(Spacer(1, 12))
    
    for member in PEMEGANG_HAK_CIPTA:
        story.append(Paragraph(member, style_bold_center))
        story.append(Spacer(1, 3))
        
    story.append(Spacer(1, 14))
    story.append(Paragraph(INSTITUSI, ParagraphStyle('Inst2', parent=style_bold_center, fontSize=12)))
    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGES 5+: LAMPIRAN KODE PROGRAM KOMPUTER
    # --------------------------------------------------------------------------
    story.append(Paragraph("LAMPIRAN KODE PROGRAM KOMPUTER", style_title_code))
    story.append(Spacer(1, 14))

    for code_info in CODE_FILES:
        f_name = code_info["name"]
        f_path = code_info["path"]
        f_desc = code_info["desc"]

        if not os.path.exists(f_path):
            continue

        with open(f_path, "r", encoding="utf-8", errors="ignore") as f:
            code_text = f.read()

        story.append(Paragraph(f"<b>// File: {f_name}</b>", ParagraphStyle('FHead', parent=style_normal, textColor=colors.HexColor('#0284c7'), fontSize=10)))
        story.append(Paragraph(f"<i>// Deskripsi: {f_desc}</i>", ParagraphStyle('FDesc', parent=style_normal, textColor=colors.HexColor('#64748b'), fontSize=8.5)))
        story.append(Spacer(1, 4))

        # Split code into chunks of ~35 lines to allow page breaks in PDF
        lines = code_text.splitlines()
        chunk_size = 35
        for i in range(0, len(lines), chunk_size):
            chunk_lines = lines[i:i + chunk_size]
            chunk_text = "\n".join(chunk_lines)
            code_p = Preformatted(chunk_text, style_code)
            c_table = RLTable([[code_p]], colWidths=[6.7 * inch])
            c_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 8),
                ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(c_table)
            story.append(Spacer(1, 4))

        story.append(Spacer(1, 12))

    pdf_doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Dokumen PDF berhasil dibuat: {PDF_OUTPUT_PATH}")


if __name__ == "__main__":
    img1, img2, img3, img4 = generate_mockup_images()
    create_word_document(img1, img2, img3, img4)
    create_pdf_document(img1, img2, img3, img4)
    print("PROSES GENERASI DOKUMEN HKI SELESAI SANGAT BAIK!")
